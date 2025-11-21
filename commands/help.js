/**
 * Help Command - List all commands or get detailed help
 * @module commands/help
 */

'use strict';

require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const PREFIX = process.env.PREFIX || 'hey';

module.exports = {
  name: 'help',
  description: 'List all commands or get detailed help for a specific command/module',
  usage: 'help [command]',

  /**
   * Execute the help command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @param {string[]} args - Command arguments
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message, args) {
    const commandsDir = path.resolve(__dirname);
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter(file => file.endsWith('.js') && file !== 'help.js');

    if (!args.length) {
      // List available commands
      const embed = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription(`Use \`${PREFIX}help <command>\` for details`)
        .setColor(0x00AAFF)
        .setTimestamp()
        .setFooter({ text: 'Lord Kelvin Bot' });

      const fields = [];
      for (const file of commandFiles) {
        try {
          const cmd = require(path.join(commandsDir, file));
          fields.push({
            name: `\`${cmd.name}\``,
            value: cmd.description || 'No description provided',
            inline: true,
          });
        } catch (error) {
          console.error(`Error loading command ${file}:`, error.message);
        }
      }

      if (fields.length > 0) {
        embed.addFields(fields);
      }

      return message.channel.send({ embeds: [embed] });
    }

    // Detailed help for a specific command
    const name = args[0].toLowerCase();
    const commandFile = commandFiles.find(f => f.replace('.js', '') === name);

    if (!commandFile) {
      return message.channel.send(`No help found for \`${name}\`.`);
    }

    try {
      const cmd = require(path.join(commandsDir, commandFile));
      const embed = new EmbedBuilder()
        .setTitle(`Help: ${cmd.name}`)
        .setDescription(cmd.description || 'No description available')
        .addFields([
          { name: 'Usage', value: `\`${PREFIX}${cmd.usage || cmd.name}\`` },
        ])
        .setColor(0x00AAFF)
        .setTimestamp();

      if (cmd.subcommands && Array.isArray(cmd.subcommands)) {
        embed.addFields([
          { name: 'Subcommands', value: cmd.subcommands.map(sc => `\`${sc}\``).join(', ') },
        ]);
      }

      if (cmd.aliases && Array.isArray(cmd.aliases)) {
        embed.addFields([
          { name: 'Aliases', value: cmd.aliases.map(a => `\`${a}\``).join(', ') },
        ]);
      }

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Error loading help for ${name}:`, error.message);
      return message.channel.send(`Error loading help for \`${name}\`.`);
    }
  },
};
