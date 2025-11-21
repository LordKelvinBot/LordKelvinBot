/**
 * Clear Array Command
 * @module commands/array/clearArray
 */

'use strict';

const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'clearArray',
  description: 'Clear all items from the shared array',
  usage: 'clearArray',
  aliases: ['clear', 'reset'],

  /**
   * Execute the clearArray command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message) {
    const previousCount = arrayStore.size();
    arrayStore.clear();

    return message.channel.send(`Array cleared. Removed ${previousCount} item(s).`);
  },
};
