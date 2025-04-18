const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'addToArray',
  description: 'Add an element to the shared array',
  execute(message, args) {
    if (!args.length) {
      return message.channel.send('Please provide a value to add.');
    }
    const item = args.join(' ');
    arrayStore.add(item);
    return message.channel.send(`Added '${item}'. Current array: [${arrayStore.get().join(', ')}]`);
  },
};