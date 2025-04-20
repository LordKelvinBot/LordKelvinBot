// voice.js
// DiscordJS v14 audio‑only voice chat with OpenAI Realtime API (beta)
// Uses opus-decoder for raw Opus → PCM decoding and wave-resampler for JS resampling

'use strict';

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  EndBehaviorType,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { RealtimeClient } = require('@openai/realtime-api-beta');
const { OpusDecoder } = require('opus-decoder');
const waveResampler = require('wave-resampler');
const { Transform, PassThrough } = require('stream');
require('dotenv').config();

// Track active guild connections
const activeConnections = new Map();

/** Initialize voice module (call once) */
function setupVoiceModule(client) {
  console.log('Voice module initialized.');
}

/** Join the user's VC and start streaming */
async function joinAndListen(message) {
  const { guild, member } = message;
  if (!member.voice.channel) {
    console.log(`[${guild.id}] User not in a voice channel.`);
    return;
  }
  await joinVC(
    guild.id,
    member.voice.channel.id,
    guild.voiceAdapterCreator,
    member.id
  );
}

/** Leave and clean up */
function leaveVC(guildId) {
  const data = activeConnections.get(guildId);
  if (!data) return false;
  data.rtClient.disconnect();
  data.voiceConnection.destroy();
  activeConnections.delete(guildId);
  console.log(`[${guildId}] Left voice channel.`);
  return true;
}

/** Core join + audio pipeline */
async function joinVC(guildId, channelId, adapterCreator, userId) {
  // 1) Connect to Discord voice
  const voiceConnection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
    selfDeaf: false,                     // must be false to receive audio :contentReference[oaicite:0]{index=0}
  });
  await entersState(
    voiceConnection,
    VoiceConnectionStatus.Ready,
    30_000
  );
  console.log(`[${guildId}] Discord voice ready.`);

  // 2) Setup audio player for AI responses
  const audioPlayer = createAudioPlayer();
  voiceConnection.subscribe(audioPlayer);

  // 3) Connect to OpenAI Realtime (audio‑only)
  const rtClient = new RealtimeClient({ apiKey: process.env.OPENAI_API_KEY });
  rtClient.updateSession({
    instructions: 'You are a helpful voice assistant.',
    voice: 'alloy',
    turn_detection: { type: 'server_vad' },
    // no input_audio_transcription = pure audio
  });
  rtClient.on('conversation.updated', ({ delta }) => {
    if (delta?.audio) playAudio(delta.audio, audioPlayer);
  });
  await rtClient.connect();
  console.log(`[${guildId}] OpenAI realtime ready.`);

  // 4) When user starts speaking, subscribe to their Opus stream
  const receiver = voiceConnection.receiver;
  receiver.speaking.on('start', async (sid) => {
    if (sid !== userId) return;
    console.log(`[${guildId}] User ${sid} started speaking; pipeline open.`);

    // 4.1) Prepare Opus decoder and wait for WASM compilation
    const decoder = new OpusDecoder({ channels: 2, rate: 48000 });
    await decoder.ready;                    // must await before decode :contentReference[oaicite:1]{index=1}

    // 4.2) Subscribe to raw Opus packets, auto‑end on silence
    const opusStream = receiver.subscribe(sid, {
      end: { behavior: EndBehaviorType.AfterSilence, duration: 200 },
    });

    // 4.3) Decode each Opus packet → PCM48 → resample → send to OpenAI
    const pcm48Stream = opusStream.pipe(new Transform({
      readableObjectMode: false,
      writableObjectMode: true,
      async transform(opusPacket, _, cb) {
        try {
          const { channelData } = decoder.decodeFrame(opusPacket);  // decodeFrame API :contentReference[oaicite:2]{index=2}
          // channelData: [Float32Array(left), Float32Array(right)]
          // Interleave and convert to Int16
          const len = channelData[0].length;
          const int16 = new Int16Array(len * 2);
          for (let i = 0; i < len; i++) {
            int16[2*i]     = Math.max(-1, Math.min(1, channelData[0][i])) * 0x7fff;
            int16[2*i + 1] = Math.max(-1, Math.min(1, channelData[1][i])) * 0x7fff;
          }
          cb(null, Buffer.from(int16.buffer));
        } catch (err) {
          console.error(`[${guildId}] Opus decode error:`, err);
          cb(); // drop bad packet
        }
      }
    }));

    pcm48Stream.on('data', (chunk) => {
      // Downsample PCM48→PCM16@16 kHz
      const samples48 = new Int16Array(chunk.buffer);
      const floats = Float32Array.from(samples48, s => s / 32768);
      const mono16 = waveResampler.resample(floats, 48000, 16000);  // resample API :contentReference[oaicite:3]{index=3}
      const pcm16 = new Int16Array(mono16.map(f => Math.max(-1, Math.min(1, f)) * 0x7fff));
      rtClient.appendInputAudio(pcm16);
    });
    pcm48Stream.on('end', () =>
      console.log(`[${guildId}] User ${sid} stopped speaking; pipeline closed.`)
    );
    pcm48Stream.on('error', (err) =>
      console.error(`[${guildId}] PCM stream error:`, err)
    );
  });

  activeConnections.set(guildId, { voiceConnection, audioPlayer, rtClient });
}

/** Play AI’s PCM16@16 kHz mono → PCM48 kHz stereo via Raw PCM */
function playAudio(audioDelta, audioPlayer) {
  // 1) Convert Int16Array → Float32Array
  const pcm16 = new Int16Array(audioDelta.buffer);
  const floats16 = Float32Array.from(pcm16, s => s / 32768);

  // 2) Upsample 16 kHz → 48 kHz mono, then duplicate for stereo
  const mono48 = waveResampler.resample(floats16, 16000, 48000);
  const stereo48 = new Int16Array(mono48.length * 2);
  mono48.forEach((f, i) => {
    const v = Math.max(-1, Math.min(1, f)) * 0x7fff;
    stereo48[2*i]     = v;
    stereo48[2*i + 1] = v;
  });

  // 3) Wrap full Buffer in PassThrough to prevent per-byte chunks
  const pcmBuffer = Buffer.from(stereo48.buffer);
  const pass = new PassThrough();
  pass.end(pcmBuffer);                     // Ensures chunk is a Buffer :contentReference[oaicite:4]{index=4}

  // 4) Play via Raw PCM; DiscordJS encodes to Opus internally
  const resource = createAudioResource(pass, { inputType: StreamType.Raw });
  audioPlayer.play(resource);
}

module.exports = { setupVoiceModule, joinAndListen, leaveVC };
