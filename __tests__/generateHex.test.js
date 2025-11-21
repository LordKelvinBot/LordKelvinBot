/**
 * Tests for generateHex module
 */

'use strict';

const {
  generateHex,
  generateHexNumber,
  isValidHex,
  hexToNumber,
} = require('../utils/generateHex');

describe('generateHex', () => {
  describe('generateHex', () => {
    test('returns a string starting with #', () => {
      const hex = generateHex();
      expect(hex.startsWith('#')).toBe(true);
    });

    test('returns a string of length 7', () => {
      const hex = generateHex();
      expect(hex).toHaveLength(7);
    });

    test('returns a valid hex color format', () => {
      const hex = generateHex();
      expect(hex).toMatch(/^#[0-9A-F]{6}$/);
    });

    test('generates different values on multiple calls', () => {
      const hexes = new Set();
      for (let i = 0; i < 100; i++) {
        hexes.add(generateHex());
      }
      // With 100 random colors, we should get more than 90 unique ones
      expect(hexes.size).toBeGreaterThan(90);
    });
  });

  describe('generateHexNumber', () => {
    test('returns a number', () => {
      const hexNum = generateHexNumber();
      expect(typeof hexNum).toBe('number');
    });

    test('returns a number between 0 and 0xffffff', () => {
      for (let i = 0; i < 100; i++) {
        const hexNum = generateHexNumber();
        expect(hexNum).toBeGreaterThanOrEqual(0);
        expect(hexNum).toBeLessThanOrEqual(0xffffff);
      }
    });

    test('returns an integer', () => {
      const hexNum = generateHexNumber();
      expect(Number.isInteger(hexNum)).toBe(true);
    });
  });

  describe('isValidHex', () => {
    test('returns true for valid 6-char hex with #', () => {
      expect(isValidHex('#FF5733')).toBe(true);
      expect(isValidHex('#000000')).toBe(true);
      expect(isValidHex('#FFFFFF')).toBe(true);
      expect(isValidHex('#abc123')).toBe(true);
    });

    test('returns true for valid 6-char hex without #', () => {
      expect(isValidHex('FF5733')).toBe(true);
      expect(isValidHex('000000')).toBe(true);
    });

    test('returns true for valid 3-char hex with #', () => {
      expect(isValidHex('#FFF')).toBe(true);
      expect(isValidHex('#000')).toBe(true);
      expect(isValidHex('#abc')).toBe(true);
    });

    test('returns true for valid 3-char hex without #', () => {
      expect(isValidHex('FFF')).toBe(true);
      expect(isValidHex('abc')).toBe(true);
    });

    test('returns false for invalid hex values', () => {
      expect(isValidHex('#GGG')).toBe(false);
      expect(isValidHex('#GGGGGG')).toBe(false);
      expect(isValidHex('#FF573')).toBe(false);
      expect(isValidHex('#FF57333')).toBe(false);
      expect(isValidHex('invalid')).toBe(false);
      expect(isValidHex('')).toBe(false);
    });

    test('returns false for non-string inputs', () => {
      expect(isValidHex(123456)).toBe(false);
      expect(isValidHex(null)).toBe(false);
      expect(isValidHex(undefined)).toBe(false);
      expect(isValidHex({})).toBe(false);
    });
  });

  describe('hexToNumber', () => {
    test('converts hex string with # to number', () => {
      expect(hexToNumber('#FF5733')).toBe(0xFF5733);
      expect(hexToNumber('#000000')).toBe(0);
      expect(hexToNumber('#FFFFFF')).toBe(0xFFFFFF);
    });

    test('converts hex string without # to number', () => {
      expect(hexToNumber('FF5733')).toBe(0xFF5733);
      expect(hexToNumber('000000')).toBe(0);
    });

    test('converts 3-char hex to number', () => {
      expect(hexToNumber('#FFF')).toBe(0xFFF);
      expect(hexToNumber('ABC')).toBe(0xABC);
    });

    test('throws error for invalid hex', () => {
      expect(() => hexToNumber('#GGG')).toThrow('Invalid hex color');
      expect(() => hexToNumber('invalid')).toThrow('Invalid hex color');
      expect(() => hexToNumber('')).toThrow('Invalid hex color');
    });
  });
});
