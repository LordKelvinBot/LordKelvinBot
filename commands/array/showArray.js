const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'showArray',
  description: 'Show all items in the shared array',
  execute(message) {
    const items = arrayStore.get();
    if (!items.length) {
      return message.channel.send('The array is currently empty.');
    }
    return message.channel.send(`Array contents: [${items.join(', ')}]`);
  },
};
