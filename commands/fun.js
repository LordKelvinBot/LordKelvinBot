/**
 * Fun Commands - Group of fun subcommands
 * @module commands/fun
 */

'use strict';

const { EmbedBuilder } = require('discord.js');
const { sendImage, getAvailableImages } = require('../utils/imageSender');
const { generateHex } = require('../utils/generateHex');

module.exports = {
  name: 'fun',
  description: 'Group of fun subcommands',
  usage: 'fun <subcommand> [args]',
  subcommands: ['clap', 'dab', 'random', 'meme', 'roll', '8ball'],

  /**
   * Execute the fun command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @param {string[]} args - Command arguments
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message, args) {
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setTitle('Fun Commands')
        .setDescription('Available fun subcommands:')
        .setColor(generateHex())
        .addFields(
          { name: 'clap', value: 'Clap between words: `fun clap <text>`', inline: true },
          { name: 'dab', value: 'Get a dab response', inline: true },
          { name: 'random', value: 'Random number: `fun random <max>`', inline: true },
          { name: 'meme', value: 'Send a meme image: `fun meme <name>`', inline: true },
          { name: 'roll', value: 'Roll dice: `fun roll [sides]`', inline: true },
          { name: '8ball', value: 'Ask a question: `fun 8ball <question>`', inline: true },
        );
      return message.channel.send({ embeds: [embed] });
    }

    const sub = args.shift().toLowerCase();

    switch (sub) {
      case 'clap': {
        if (!args.length) {
          return message.channel.send('Usage: `fun clap <text>`');
        }
        const clapText = args.map(word => word.toUpperCase()).join(' :clap: ');
        return message.channel.send(clapText);
      }

      case 'dab': {
        const dabResponses = [
          '*dabs*',
          'No.',
          '*dabs aggressively*',
          'Dabbing is so 2016...',
          '*reluctantly dabs*',
        ];
        const response = dabResponses[Math.floor(Math.random() * dabResponses.length)];
        return message.channel.send(response);
      }

      case 'random': {
        const n = parseInt(args[0], 10);
        if (Number.isNaN(n) || n <= 0) {
          return message.channel.send('Usage: `fun random <positive integer>`');
        }
        const rand = Math.floor(Math.random() * n) + 1;
        return message.channel.send(`Your random number (1-${n}): **${rand}**`);
      }

      case 'meme': {
        if (!args.length) {
          const available = getAvailableImages();
          if (available.length === 0) {
            return message.channel.send('No meme images available.');
          }
          return message.channel.send(`Usage: \`fun meme <name>\`\nAvailable: ${available.slice(0, 20).join(', ')}${available.length > 20 ? '...' : ''}`);
        }
        return sendImage(message, args[0].toLowerCase());
      }

      case 'roll': {
        const sides = parseInt(args[0], 10) || 6;
        if (sides < 2 || sides > 1000) {
          return message.channel.send('Dice must have between 2 and 1000 sides.');
        }
        const result = Math.floor(Math.random() * sides) + 1;
        return message.channel.send(`:game_die: You rolled a **${result}** (d${sides})`);
      }

      case '8ball': {
        if (!args.length) {
          return message.channel.send('Usage: `fun 8ball <question>`');
        }
        const responses = [
          'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
          'Ask again later', 'Without a doubt', 'Very doubtful',
          'It is certain', 'Cannot predict now', 'My sources say no',
          'Outlook good', 'Signs point to yes', 'Better not tell you now',
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        const embed = new EmbedBuilder()
          .setTitle(':8ball: Magic 8-Ball')
          .addFields(
            { name: 'Question', value: args.join(' ') },
            { name: 'Answer', value: `**${response}**` },
          )
          .setColor(generateHex());
        return message.channel.send({ embeds: [embed] });
      }

      default:
        return message.channel.send(`Unknown fun subcommand: \`${sub}\`. Use \`fun\` to see available commands.`);
    }
  },
};
