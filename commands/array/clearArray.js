const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'clearArray',
  description: 'Clear all items from the shared array',
  execute(message) {
    arrayStore.clear();
    return message.channel.send('Array cleared.');
  },
};