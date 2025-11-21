const { MessageEmbed } = require('discord.js');
const { sendImage } = require('../utils/imageSender');

module.exports = {
  name: 'fun',
  description: 'Group of fun subcommands',
  execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please specify a fun command: clap, dab, random, meme');
    }
    const sub = args.shift().toLowerCase();

    switch (sub) {
      case 'clap':
        // Emphasize text by inserting 👏 between words
        if (!args.length) return message.channel.send('Usage: fun clap <text>');
        const clapText = args.map(word => word.toUpperCase()).join(' 👏 ');
        return message.channel.send(clapText);

      case 'dab':
        return message.channel.send('💃✨ Dab! ✨💃');

      case 'random':
        // Send one random number between 0 and n-1
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n <= 0) {
          return message.channel.send('Usage: fun random <positive integer>');
        }
        const rand = Math.floor(Math.random() * n);
        return message.channel.send(`Your random number: ${rand}`);

      case 'meme':
        // Send a named meme image (filename without extension)
        if (!args.length) return message.channel.send('Usage: fun meme <name>');
        return sendImage(message, args[0].toLowerCase());

      default:
        return message.channel.send(`Unknown fun subcommand: ${sub}`);
    }
  },
};
