/**
 * Shuffle Array Command
 * @module commands/array/shuffleArray
 */

'use strict';

const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'shuffleArray',
  description: 'Randomly shuffle the shared array',
  usage: 'shuffleArray',
  aliases: ['shuffle', 'randomize'],

  /**
   * Execute the shuffleArray command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message) {
    if (arrayStore.isEmpty()) {
      return message.channel.send('Cannot shuffle an empty array.');
    }

    const shuffled = arrayStore.shuffle();
    return message.channel.send(`Shuffled array: [${shuffled.join(', ')}]`);
  },
};
