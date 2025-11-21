/**
 * Show Array Command
 * @module commands/array/showArray
 */

'use strict';

const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'showArray',
  description: 'Show all items in the shared array',
  usage: 'showArray',
  aliases: ['list', 'show'],

  /**
   * Execute the showArray command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message) {
    const items = arrayStore.get();

    if (items.length === 0) {
      return message.channel.send('The array is currently empty.');
    }

    return message.channel.send(`Array contents (${items.length} items): [${items.join(', ')}]`);
  },
};
