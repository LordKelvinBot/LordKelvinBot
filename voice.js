/**
 * Voice AI Module - Discord Voice Chat with OpenAI Realtime API
 * @module voice
 *
 * Handles real-time voice conversations using:
 * - Discord.js voice for audio capture/playback
 * - OpenAI Realtime API for AI responses
 * - opus-decoder for Opus to PCM conversion
 * - wave-resampler for sample rate conversion
 */

'use strict';

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  EndBehaviorType,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const { RealtimeClient } = require('@openai/realtime-api-beta');
const { OpusDecoder } = require('opus-decoder');
const waveResampler = require('wave-resampler');
const { Transform, PassThrough } = require('stream');
require('dotenv').config();

/** @type {Map<string, ConnectionData>} Track active guild connections */
const activeConnections = new Map();

/** @type {import('discord.js').Client|null} Discord client reference */
let discordClient = null;

/**
 * @typedef {Object} ConnectionData
 * @property {import('@discordjs/voice').VoiceConnection} voiceConnection
 * @property {import('@discordjs/voice').AudioPlayer} audioPlayer
 * @property {RealtimeClient} rtClient
 * @property {string} channelId
 * @property {string[]} allowedUsers - User IDs allowed to interact
 * @property {Buffer[]} audioQueue - Queue of audio buffers to play
 * @property {boolean} isPlaying - Whether audio is currently playing
 */

/**
 * Voice module configuration
 * @type {Object}
 */
const CONFIG = {
  // Audio settings
  DISCORD_SAMPLE_RATE: 48000,
  OPENAI_SAMPLE_RATE: 24000,
  OPUS_CHANNELS: 2,

  // Timing settings
  CONNECTION_TIMEOUT: 30000,
  SILENCE_DURATION: 300,
  RECONNECT_DELAY: 5000,
  MAX_RECONNECT_ATTEMPTS: 3,

  // Session settings
  DEFAULT_VOICE: 'alloy',
  DEFAULT_MODEL: 'gpt-4o-mini-realtime-preview',
  DEFAULT_INSTRUCTIONS: 'You are a helpful voice assistant named Kelvin. Keep responses concise and conversational.',
};

/**
 * Initialize voice module with Discord client reference
 * @param {import('discord.js').Client} client - Discord.js client
 */
function setupVoiceModule(client) {
  discordClient = client;
  console.log('[Voice] Module initialized');

  // Handle client disconnect
  client.on('voiceStateUpdate', (oldState, newState) => {
    // Bot was disconnected from voice
    if (oldState.member?.id === client.user?.id && !newState.channelId) {
      const guildId = oldState.guild.id;
      cleanupConnection(guildId, 'Bot disconnected from voice channel');
    }
  });
}

/**
 * Check if the bot is connected to voice in a guild
 * @param {string} guildId - The guild ID
 * @returns {boolean} True if connected
 */
function isConnected(guildId) {
  return activeConnections.has(guildId);
}

/**
 * Get connection info for a guild
 * @param {string} guildId - The guild ID
 * @returns {Object|null} Connection info or null
 */
function getConnectionInfo(guildId) {
  const data = activeConnections.get(guildId);
  if (!data) {
    return null;
  }
  return {
    channelId: data.channelId,
    allowedUsers: data.allowedUsers,
    isPlaying: data.isPlaying,
    queueLength: data.audioQueue.length,
  };
}

/**
 * Join user's voice channel and start listening
 * @param {import('discord.js').Message} message - The message that triggered the command
 * @param {Object} [options] - Join options
 * @param {string} [options.voice] - Voice to use (alloy, echo, etc.)
 * @param {string} [options.instructions] - Custom instructions for the AI
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function joinAndListen(message, options = {}) {
  const { guild, member } = message;

  // Validate user is in a voice channel
  if (!member.voice.channel) {
    return { success: false, message: 'You must be in a voice channel to use this command.' };
  }

  // Check if already connected to this guild
  if (isConnected(guild.id)) {
    const info = getConnectionInfo(guild.id);
    if (info.channelId === member.voice.channel.id) {
      return { success: false, message: 'Already connected to your voice channel.' };
    }
    // Disconnect from old channel first
    await leaveVC(guild.id);
  }

  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    return { success: false, message: 'OpenAI API key not configured.' };
  }

  try {
    await joinVC(
      guild.id,
      member.voice.channel.id,
      guild.voiceAdapterCreator,
      [member.id], // Initially only the caller can interact
      options,
    );
    return {
      success: true,
      message: `Joined ${member.voice.channel.name}. Start speaking to chat with the AI!`,
    };
  } catch (error) {
    console.error(`[Voice][${guild.id}] Failed to join:`, error);
    return { success: false, message: `Failed to join voice channel: ${error.message}` };
  }
}

/**
 * Leave voice channel and cleanup
 * @param {string} guildId - The guild ID
 * @returns {boolean} True if successfully left
 */
function leaveVC(guildId) {
  return cleanupConnection(guildId, 'Manual disconnect');
}

/**
 * Add a user to the allowed list
 * @param {string} guildId - The guild ID
 * @param {string} userId - The user ID to add
 * @returns {boolean} True if added
 */
function addAllowedUser(guildId, userId) {
  const data = activeConnections.get(guildId);
  if (!data) {
    return false;
  }
  if (!data.allowedUsers.includes(userId)) {
    data.allowedUsers.push(userId);
  }
  return true;
}

/**
 * Remove a user from the allowed list
 * @param {string} guildId - The guild ID
 * @param {string} userId - The user ID to remove
 * @returns {boolean} True if removed
 */
function removeAllowedUser(guildId, userId) {
  const data = activeConnections.get(guildId);
  if (!data) {
    return false;
  }
  const index = data.allowedUsers.indexOf(userId);
  if (index > -1) {
    data.allowedUsers.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Clean up a connection
 * @param {string} guildId - The guild ID
 * @param {string} reason - Reason for cleanup
 * @returns {boolean} True if cleaned up
 */
function cleanupConnection(guildId, reason) {
  const data = activeConnections.get(guildId);
  if (!data) {
    return false;
  }

  console.log(`[Voice][${guildId}] Cleaning up: ${reason}`);

  try {
    // Disconnect from OpenAI
    if (data.rtClient) {
      data.rtClient.disconnect();
    }
  } catch (error) {
    console.error(`[Voice][${guildId}] Error disconnecting rtClient:`, error);
  }

  try {
    // Destroy voice connection
    if (data.voiceConnection) {
      data.voiceConnection.destroy();
    }
  } catch (error) {
    console.error(`[Voice][${guildId}] Error destroying voice connection:`, error);
  }

  activeConnections.delete(guildId);
  console.log(`[Voice][${guildId}] Left voice channel`);
  return true;
}

/**
 * Core voice channel join and audio pipeline setup
 * @param {string} guildId - Discord guild ID
 * @param {string} channelId - Voice channel ID
 * @param {Function} adapterCreator - Voice adapter creator
 * @param {string[]} allowedUsers - User IDs allowed to interact
 * @param {Object} options - Configuration options
 */
async function joinVC(guildId, channelId, adapterCreator, allowedUsers, options = {}) {
  const voice = options.voice || CONFIG.DEFAULT_VOICE;
  const instructions = options.instructions || CONFIG.DEFAULT_INSTRUCTIONS;

  // 1) Connect to Discord voice
  console.log(`[Voice][${guildId}] Connecting to voice channel ${channelId}...`);
  const voiceConnection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
    selfDeaf: false, // Must be false to receive audio
  });

  // Handle connection state changes
  voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
    console.log(`[Voice][${guildId}] Connection disconnected, attempting recovery...`);
    try {
      await Promise.race([
        entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5000),
        entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5000),
      ]);
      // Connection is recovering
    } catch (error) {
      // Connection is not recovering, cleanup
      cleanupConnection(guildId, 'Connection failed to recover');
    }
  });

  voiceConnection.on('error', (error) => {
    console.error(`[Voice][${guildId}] Voice connection error:`, error);
  });

  await entersState(voiceConnection, VoiceConnectionStatus.Ready, CONFIG.CONNECTION_TIMEOUT);
  console.log(`[Voice][${guildId}] Discord voice ready`);

  // 2) Setup audio player for AI responses
  const audioPlayer = createAudioPlayer();
  voiceConnection.subscribe(audioPlayer);

  // Initialize connection data
  /** @type {ConnectionData} */
  const connectionData = {
    voiceConnection,
    audioPlayer,
    rtClient: null,
    channelId,
    allowedUsers,
    audioQueue: [],
    isPlaying: false,
  };

  // Handle audio player state changes
  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    connectionData.isPlaying = false;
    playNextInQueue(connectionData);
  });

  audioPlayer.on('error', (error) => {
    console.error(`[Voice][${guildId}] Audio player error:`, error);
    connectionData.isPlaying = false;
    playNextInQueue(connectionData);
  });

  // 3) Connect to OpenAI Realtime API
  console.log(`[Voice][${guildId}] Connecting to OpenAI Realtime API...`);
  const rtClient = new RealtimeClient({ apiKey: process.env.OPENAI_API_KEY });

  // Configure session
  rtClient.updateSession({
    instructions,
    voice,
    turn_detection: { type: 'server_vad' },
    model: CONFIG.DEFAULT_MODEL,
    input_audio_format: 'pcm16',
    output_audio_format: 'pcm16',
  });

  // Handle AI audio responses
  rtClient.on('conversation.updated', ({ item, delta }) => {
    if (delta?.audio) {
      queueAudio(connectionData, delta.audio, guildId);
    }
  });

  // Handle errors
  rtClient.on('error', (error) => {
    console.error(`[Voice][${guildId}] OpenAI Realtime error:`, error);
  });

  // Handle connection close
  rtClient.on('close', () => {
    console.log(`[Voice][${guildId}] OpenAI connection closed`);
  });

  await rtClient.connect();
  connectionData.rtClient = rtClient;
  console.log(`[Voice][${guildId}] OpenAI Realtime ready`);

  // 4) Setup audio receiving pipeline
  const receiver = voiceConnection.receiver;

  receiver.speaking.on('start', async (userId) => {
    // Only process audio from allowed users
    if (!connectionData.allowedUsers.includes(userId)) {
      return;
    }

    console.log(`[Voice][${guildId}] User ${userId} started speaking`);

    try {
      // Prepare Opus decoder
      const decoder = new OpusDecoder({
        channels: CONFIG.OPUS_CHANNELS,
        rate: CONFIG.DISCORD_SAMPLE_RATE,
      });
      await decoder.ready;

      // Subscribe to user's audio stream
      const opusStream = receiver.subscribe(userId, {
        end: { behavior: EndBehaviorType.AfterSilence, duration: CONFIG.SILENCE_DURATION },
      });

      // Transform Opus packets to PCM
      const pcmTransform = createPcmTransform(decoder, guildId);
      const pcmStream = opusStream.pipe(pcmTransform);

      // Send PCM data to OpenAI
      pcmStream.on('data', (chunk) => {
        if (connectionData.rtClient) {
          const samples48 = new Int16Array(chunk.buffer, chunk.byteOffset, chunk.length / 2);
          const floats = Float32Array.from(samples48, (s) => s / 32768);
          // Downsample from 48kHz to 24kHz
          const resampled = waveResampler.resample(floats, CONFIG.DISCORD_SAMPLE_RATE, CONFIG.OPENAI_SAMPLE_RATE);
          const pcm24 = new Int16Array(resampled.map((f) => Math.max(-1, Math.min(1, f)) * 0x7fff));
          connectionData.rtClient.appendInputAudio(pcm24);
        }
      });

      pcmStream.on('end', () => {
        console.log(`[Voice][${guildId}] User ${userId} stopped speaking`);
      });

      pcmStream.on('error', (error) => {
        console.error(`[Voice][${guildId}] PCM stream error:`, error);
      });
    } catch (error) {
      console.error(`[Voice][${guildId}] Error setting up audio pipeline:`, error);
    }
  });

  // Store connection data
  activeConnections.set(guildId, connectionData);
}

/**
 * Create a transform stream for Opus to PCM conversion
 * @param {OpusDecoder} decoder - The Opus decoder instance
 * @param {string} guildId - Guild ID for logging
 * @returns {Transform} The transform stream
 */
function createPcmTransform(decoder, guildId) {
  return new Transform({
    readableObjectMode: false,
    writableObjectMode: true,
    transform(opusPacket, encoding, callback) {
      try {
        const { channelData } = decoder.decodeFrame(opusPacket);
        // channelData: [Float32Array(left), Float32Array(right)]
        const len = channelData[0].length;
        const int16 = new Int16Array(len * 2);

        // Interleave stereo channels
        for (let i = 0; i < len; i++) {
          int16[2 * i] = Math.max(-1, Math.min(1, channelData[0][i])) * 0x7fff;
          int16[2 * i + 1] = Math.max(-1, Math.min(1, channelData[1][i])) * 0x7fff;
        }

        callback(null, Buffer.from(int16.buffer));
      } catch (error) {
        console.error(`[Voice][${guildId}] Opus decode error:`, error.message);
        callback(); // Drop bad packet
      }
    },
  });
}

/**
 * Queue audio for playback
 * @param {ConnectionData} connectionData - The connection data
 * @param {Int16Array|ArrayBuffer} audioDelta - The audio data from OpenAI
 * @param {string} guildId - Guild ID for logging
 */
function queueAudio(connectionData, audioDelta, guildId) {
  try {
    // Convert to Int16Array if needed
    const pcm24 = audioDelta instanceof Int16Array
      ? audioDelta
      : new Int16Array(audioDelta);

    // Convert to Float32 for resampling
    const floats24 = Float32Array.from(pcm24, (s) => s / 32768);

    // Upsample from 24kHz to 48kHz
    const resampled = waveResampler.resample(floats24, CONFIG.OPENAI_SAMPLE_RATE, CONFIG.DISCORD_SAMPLE_RATE);

    // Convert to stereo Int16
    const stereo48 = new Int16Array(resampled.length * 2);
    for (let i = 0; i < resampled.length; i++) {
      const v = Math.max(-1, Math.min(1, resampled[i])) * 0x7fff;
      stereo48[2 * i] = v;
      stereo48[2 * i + 1] = v;
    }

    // Add to queue
    connectionData.audioQueue.push(Buffer.from(stereo48.buffer));

    // Start playback if not already playing
    if (!connectionData.isPlaying) {
      playNextInQueue(connectionData);
    }
  } catch (error) {
    console.error(`[Voice][${guildId}] Error queueing audio:`, error);
  }
}

/**
 * Play the next audio buffer in the queue
 * @param {ConnectionData} connectionData - The connection data
 */
function playNextInQueue(connectionData) {
  if (connectionData.audioQueue.length === 0) {
    connectionData.isPlaying = false;
    return;
  }

  // Combine multiple small buffers for smoother playback
  const buffersToPlay = [];
  let totalLength = 0;
  const maxBufferSize = 48000 * 2 * 2; // 1 second of stereo 48kHz audio

  while (connectionData.audioQueue.length > 0 && totalLength < maxBufferSize) {
    const buffer = connectionData.audioQueue.shift();
    buffersToPlay.push(buffer);
    totalLength += buffer.length;
  }

  if (buffersToPlay.length === 0) {
    connectionData.isPlaying = false;
    return;
  }

  const combinedBuffer = Buffer.concat(buffersToPlay);
  const pass = new PassThrough();
  pass.end(combinedBuffer);

  const resource = createAudioResource(pass, { inputType: StreamType.Raw });
  connectionData.isPlaying = true;
  connectionData.audioPlayer.play(resource);
}

module.exports = {
  setupVoiceModule,
  joinAndListen,
  leaveVC,
  isConnected,
  getConnectionInfo,
  addAllowedUser,
  removeAllowedUser,
};
