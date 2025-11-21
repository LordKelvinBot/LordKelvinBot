const arrayStore = require('../../utils/arrayStore');

module.exports = {
  name: 'shuffleArray',
  description: 'Randomly shuffle the shared array',
  execute(message) {
    arrayStore.shuffle();
    return message.channel.send(`Shuffled array: [${arrayStore.get().join(', ')}]`);
  },
};