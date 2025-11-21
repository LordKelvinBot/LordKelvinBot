/**
 * Voice Command - Voice AI chat functionality
 * @module commands/voice
 */

'use strict';

const { EmbedBuilder } = require('discord.js');
const {
  setupVoiceModule,
  joinAndListen,
  leaveVC,
  isConnected,
  getConnectionInfo,
  addAllowedUser,
  removeAllowedUser,
} = require('../voice');
const { generateHex } = require('../utils/generateHex');

/** Available voice options */
const AVAILABLE_VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];

module.exports = {
  name: 'voice',
  description: 'Voice AI chat commands - talk to the AI in voice channels',
  usage: 'voice <subcommand> [args]',
  subcommands: ['join', 'leave', 'status', 'allow', 'remove'],
  aliases: ['vc', 'voicechat'],

  /**
   * Execute the voice command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @param {string[]} args - Command arguments
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message, args) {
    if (!args.length) {
      return sendHelp(message);
    }

    const subcommand = args.shift().toLowerCase();

    switch (subcommand) {
      case 'join':
      case 'start':
      case 'connect':
        return handleJoin(message, args);

      case 'leave':
      case 'stop':
      case 'disconnect':
      case 'dc':
        return handleLeave(message);

      case 'status':
      case 'info':
        return handleStatus(message);

      case 'allow':
      case 'add':
        return handleAllow(message, args);

      case 'remove':
      case 'deny':
        return handleRemove(message, args);

      case 'help':
        return sendHelp(message);

      default:
        return message.channel.send(`Unknown subcommand: \`${subcommand}\`. Use \`voice help\` for available commands.`);
    }
  },
};

/**
 * Send help embed
 * @param {import('discord.js').Message} message
 */
async function sendHelp(message) {
  const embed = new EmbedBuilder()
    .setTitle('Voice AI Commands')
    .setDescription('Talk to the AI in voice channels using OpenAI\'s Realtime API')
    .setColor(generateHex())
    .addFields(
      { name: 'voice join [voice]', value: 'Join your voice channel and start listening\nVoices: ' + AVAILABLE_VOICES.join(', '), inline: false },
      { name: 'voice leave', value: 'Leave the voice channel', inline: true },
      { name: 'voice status', value: 'Show current voice status', inline: true },
      { name: 'voice allow @user', value: 'Allow a user to talk to the AI', inline: false },
      { name: 'voice remove @user', value: 'Remove a user from the allowed list', inline: false },
    )
    .setFooter({ text: 'Note: Only allowed users can interact with the AI' });

  return message.channel.send({ embeds: [embed] });
}

/**
 * Handle join subcommand
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
async function handleJoin(message, args) {
  // Check for admin restriction (if enabled)
  const isAdmin = message.member.permissions.has('Administrator') ||
                  message.author.id === '181284528793452545'; // Bot owner

  // Parse voice option
  let voice = 'alloy';
  if (args.length > 0) {
    const requestedVoice = args[0].toLowerCase();
    if (AVAILABLE_VOICES.includes(requestedVoice)) {
      voice = requestedVoice;
    } else {
      return message.channel.send(`Invalid voice: \`${requestedVoice}\`. Available: ${AVAILABLE_VOICES.join(', ')}`);
    }
  }

  // Send "connecting" message
  const connectingMsg = await message.channel.send(':microphone: Connecting to voice channel...');

  try {
    const result = await joinAndListen(message, { voice });

    if (result.success) {
      const embed = new EmbedBuilder()
        .setTitle(':white_check_mark: Voice AI Connected')
        .setDescription(result.message)
        .setColor(0x00FF00)
        .addFields(
          { name: 'Voice', value: voice, inline: true },
          { name: 'Allowed Users', value: `<@${message.author.id}>`, inline: true },
        )
        .setFooter({ text: 'Use "voice allow @user" to let others interact' });

      await connectingMsg.edit({ content: null, embeds: [embed] });
    } else {
      await connectingMsg.edit(`:x: ${result.message}`);
    }
  } catch (error) {
    console.error('[Voice Command] Join error:', error);
    await connectingMsg.edit(':x: An error occurred while joining the voice channel.');
  }
}

/**
 * Handle leave subcommand
 * @param {import('discord.js').Message} message
 */
async function handleLeave(message) {
  const guildId = message.guild.id;

  if (!isConnected(guildId)) {
    return message.channel.send(':x: Not connected to a voice channel.');
  }

  const success = leaveVC(guildId);

  if (success) {
    return message.channel.send(':wave: Disconnected from voice channel.');
  } else {
    return message.channel.send(':x: Failed to disconnect.');
  }
}

/**
 * Handle status subcommand
 * @param {import('discord.js').Message} message
 */
async function handleStatus(message) {
  const guildId = message.guild.id;

  if (!isConnected(guildId)) {
    return message.channel.send(':x: Not connected to a voice channel.');
  }

  const info = getConnectionInfo(guildId);

  const embed = new EmbedBuilder()
    .setTitle(':microphone: Voice AI Status')
    .setColor(generateHex())
    .addFields(
      { name: 'Channel', value: `<#${info.channelId}>`, inline: true },
      { name: 'Playing Audio', value: info.isPlaying ? 'Yes' : 'No', inline: true },
      { name: 'Queue Length', value: info.queueLength.toString(), inline: true },
      { name: 'Allowed Users', value: info.allowedUsers.map((id) => `<@${id}>`).join(', ') || 'None', inline: false },
    );

  return message.channel.send({ embeds: [embed] });
}

/**
 * Handle allow subcommand
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
async function handleAllow(message, args) {
  const guildId = message.guild.id;

  if (!isConnected(guildId)) {
    return message.channel.send(':x: Not connected to a voice channel.');
  }

  // Get mentioned user
  const mentioned = message.mentions.users.first();
  if (!mentioned) {
    return message.channel.send('Please mention a user to allow. Usage: `voice allow @user`');
  }

  const success = addAllowedUser(guildId, mentioned.id);

  if (success) {
    return message.channel.send(`:white_check_mark: <@${mentioned.id}> can now interact with the Voice AI.`);
  } else {
    return message.channel.send(':x: Failed to add user.');
  }
}

/**
 * Handle remove subcommand
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
async function handleRemove(message, args) {
  const guildId = message.guild.id;

  if (!isConnected(guildId)) {
    return message.channel.send(':x: Not connected to a voice channel.');
  }

  // Get mentioned user
  const mentioned = message.mentions.users.first();
  if (!mentioned) {
    return message.channel.send('Please mention a user to remove. Usage: `voice remove @user`');
  }

  const success = removeAllowedUser(guildId, mentioned.id);

  if (success) {
    return message.channel.send(`:white_check_mark: <@${mentioned.id}> can no longer interact with the Voice AI.`);
  } else {
    return message.channel.send(':x: User was not in the allowed list.');
  }
}
