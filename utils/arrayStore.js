/**
 * Array Store - Simple in-memory array storage
 * @module utils/arrayStore
 */

'use strict';

/** @type {string[]} */
let array = [];

/**
 * Add an item to the array
 * @param {string} item - The item to add
 * @returns {number} The new length of the array
 */
function add(item) {
  if (item === undefined || item === null) {
    throw new TypeError('Item cannot be undefined or null');
  }
  return array.push(item);
}

/**
 * Get a copy of the current array
 * @returns {string[]} A copy of the array
 */
function get() {
  return [...array];
}

/**
 * Clear all items from the array
 * @returns {void}
 */
function clear() {
  array = [];
}

/**
 * Shuffle the array in place using Fisher-Yates algorithm
 * @returns {string[]} The shuffled array
 */
function shuffle() {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return [...array];
}

/**
 * Get a random item from the array
 * @returns {string|undefined} A random item, or undefined if array is empty
 */
function getRandom() {
  if (array.length === 0) {
    return undefined;
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Get the current size of the array
 * @returns {number} The number of items in the array
 */
function size() {
  return array.length;
}

/**
 * Check if the array is empty
 * @returns {boolean} True if empty, false otherwise
 */
function isEmpty() {
  return array.length === 0;
}

module.exports = {
  add,
  get,
  clear,
  shuffle,
  getRandom,
  size,
  isEmpty,
};
