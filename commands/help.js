
require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const PREFIX = process.env.PREFIX || 'hey';

module.exports = {
  name: 'help',
  description: 'List all commands or get detailed help for a specific command/module',
  usage: 'help [command]',
  execute(message, args) {
    const commandsDir = path.resolve(__dirname);
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter(file => file.endsWith('.js') && file !== 'help.js');

    if (!args.length) {
      // List available commands
      const embed = new MessageEmbed()
        .setTitle('Available Commands')
        .setDescription(`Use \`${PREFIX}help <command>\` for details`)
        .setColor('#00AAFF');

      commandFiles.forEach(file => {
        const cmd = require(path.join(commandsDir, file));
        embed.addField(`\`${cmd.name}\``, cmd.description || 'No description provided', true);
      });

      return message.channel.send({ embeds: [embed] });
    }

    // Detailed help for a specific command
    const name = args[0].toLowerCase();
    const commandFile = commandFiles.find(f => f.replace('.js', '') === name);
    if (!commandFile) {
      return message.channel.send(`No help found for \`${name}\`.`);
    }

    const cmd = require(path.join(commandsDir, commandFile));
    const embed = new MessageEmbed()
      .setTitle(`Help: ${cmd.name}`)
      .setDescription(cmd.description || 'No description available')
      .addField('Usage', `\`${PREFIX}${cmd.usage || cmd.name}\``)
      .setColor('#00AAFF');

    if (cmd.subcommands) {
      embed.addField('Subcommands', cmd.subcommands.map(sc => `\`${sc}\``).join(', '));
    }

    return message.channel.send({ embeds: [embed] });
  },
};
