/**
 * Tests for arrayStore module
 */

'use strict';

const arrayStore = require('../utils/arrayStore');

describe('arrayStore', () => {
  // Clear the array before each test
  beforeEach(() => {
    arrayStore.clear();
  });

  describe('add', () => {
    test('adds an item to the array', () => {
      arrayStore.add('test');
      expect(arrayStore.get()).toContain('test');
    });

    test('returns the new length of the array', () => {
      expect(arrayStore.add('first')).toBe(1);
      expect(arrayStore.add('second')).toBe(2);
    });

    test('adds multiple items', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.add('c');
      expect(arrayStore.get()).toEqual(['a', 'b', 'c']);
    });

    test('throws TypeError for undefined input', () => {
      expect(() => arrayStore.add(undefined)).toThrow(TypeError);
    });

    test('throws TypeError for null input', () => {
      expect(() => arrayStore.add(null)).toThrow(TypeError);
    });

    test('accepts empty string', () => {
      arrayStore.add('');
      expect(arrayStore.get()).toContain('');
    });

    test('accepts numbers as strings', () => {
      arrayStore.add('123');
      expect(arrayStore.get()).toContain('123');
    });
  });

  describe('get', () => {
    test('returns empty array when no items added', () => {
      expect(arrayStore.get()).toEqual([]);
    });

    test('returns a copy of the array', () => {
      arrayStore.add('item');
      const arr = arrayStore.get();
      arr.push('modified');
      expect(arrayStore.get()).toEqual(['item']);
    });

    test('returns all added items', () => {
      arrayStore.add('one');
      arrayStore.add('two');
      arrayStore.add('three');
      expect(arrayStore.get()).toEqual(['one', 'two', 'three']);
    });
  });

  describe('clear', () => {
    test('removes all items from the array', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.clear();
      expect(arrayStore.get()).toEqual([]);
    });

    test('works when array is already empty', () => {
      arrayStore.clear();
      expect(arrayStore.get()).toEqual([]);
    });
  });

  describe('shuffle', () => {
    test('returns a copy of the shuffled array', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.add('c');
      const shuffled = arrayStore.shuffle();
      expect(shuffled).toHaveLength(3);
    });

    test('maintains all original items', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.add('c');
      const shuffled = arrayStore.shuffle();
      expect(shuffled.sort()).toEqual(['a', 'b', 'c']);
    });

    test('returns empty array when empty', () => {
      expect(arrayStore.shuffle()).toEqual([]);
    });

    test('returns array with single item unchanged', () => {
      arrayStore.add('only');
      expect(arrayStore.shuffle()).toEqual(['only']);
    });
  });

  describe('getRandom', () => {
    test('returns undefined for empty array', () => {
      expect(arrayStore.getRandom()).toBeUndefined();
    });

    test('returns the only item in single-item array', () => {
      arrayStore.add('only');
      expect(arrayStore.getRandom()).toBe('only');
    });

    test('returns an item from the array', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.add('c');
      const random = arrayStore.getRandom();
      expect(['a', 'b', 'c']).toContain(random);
    });
  });

  describe('size', () => {
    test('returns 0 for empty array', () => {
      expect(arrayStore.size()).toBe(0);
    });

    test('returns correct count after adding items', () => {
      arrayStore.add('a');
      expect(arrayStore.size()).toBe(1);
      arrayStore.add('b');
      expect(arrayStore.size()).toBe(2);
    });

    test('returns 0 after clearing', () => {
      arrayStore.add('a');
      arrayStore.add('b');
      arrayStore.clear();
      expect(arrayStore.size()).toBe(0);
    });
  });

  describe('isEmpty', () => {
    test('returns true for empty array', () => {
      expect(arrayStore.isEmpty()).toBe(true);
    });

    test('returns false after adding items', () => {
      arrayStore.add('a');
      expect(arrayStore.isEmpty()).toBe(false);
    });

    test('returns true after clearing', () => {
      arrayStore.add('a');
      arrayStore.clear();
      expect(arrayStore.isEmpty()).toBe(true);
    });
  });
});
