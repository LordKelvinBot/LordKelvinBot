let array = [];

function add(item) {
  array.push(item);
}

function get() {
  return array;
}

function clear() {
  array = [];
}

function shuffle() {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = { add, get, clear, shuffle };