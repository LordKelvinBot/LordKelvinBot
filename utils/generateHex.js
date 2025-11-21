/**
 * Hex Color Generator Utility
 * @module utils/generateHex
 */

'use strict';

/**
 * Generate a random hex color code
 * @returns {string} A random hex color string (e.g., '#FF5733')
 */
function generateHex() {
  const randomValue = Math.floor(Math.random() * 0xffffff);
  return '#' + randomValue.toString(16).padStart(6, '0').toUpperCase();
}

/**
 * Generate a random hex color as a number (for Discord embeds)
 * @returns {number} A random color number
 */
function generateHexNumber() {
  return Math.floor(Math.random() * 0xffffff);
}

/**
 * Validate if a string is a valid hex color
 * @param {string} hex - The hex string to validate
 * @returns {boolean} True if valid hex color
 */
function isValidHex(hex) {
  if (typeof hex !== 'string') {
    return false;
  }
  return /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

/**
 * Convert hex string to number
 * @param {string} hex - The hex color string
 * @returns {number} The color as a number
 */
function hexToNumber(hex) {
  if (!isValidHex(hex)) {
    throw new Error('Invalid hex color');
  }
  const cleaned = hex.replace('#', '');
  return parseInt(cleaned, 16);
}

module.exports = {
  generateHex,
  generateHexNumber,
  isValidHex,
  hexToNumber,
};

// Default export for backward compatibility
module.exports.default = generateHex;
