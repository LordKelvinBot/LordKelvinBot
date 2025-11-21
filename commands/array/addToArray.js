/**
 * Add to Array Command
 * @module commands/array/addToArray
 */

'use strict';

const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'addToArray',
  description: 'Add an element to the shared array',
  usage: 'addToArray <item>',
  aliases: ['push', 'add'],

  /**
   * Execute the addToArray command
   * @param {import('discord.js').Message} message - The message that triggered the command
   * @param {string[]} args - Command arguments
   * @returns {Promise<import('discord.js').Message>}
   */
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide a value to add. Usage: `addToArray <item>`');
    }

    const item = args.join(' ');
    arrayStore.add(item);
    const currentArray = arrayStore.get();

    return message.channel.send(
      `Added '${item}'. Current array (${currentArray.length} items): [${currentArray.join(', ')}]`,
    );
  },
};
