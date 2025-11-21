/**
 * Mathematical Utility Functions
 * @module utils/mathUtils
 */

'use strict';

/**
 * Convert degrees to radians
 * @param {number} degrees - The angle in degrees
 * @returns {number} The angle in radians
 */
function degreesToRadians(degrees) {
  if (typeof degrees !== 'number' || Number.isNaN(degrees)) {
    throw new TypeError('degrees must be a valid number');
  }
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - The angle in radians
 * @returns {number} The angle in degrees
 */
function radiansToDegrees(radians) {
  if (typeof radians !== 'number' || Number.isNaN(radians)) {
    throw new TypeError('radians must be a valid number');
  }
  return radians * (180 / Math.PI);
}

/**
 * Calculate the square root of a number
 * @param {number} n - The number to find the square root of
 * @returns {number} The square root
 */
function sqrt(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError('n must be a valid number');
  }
  if (n < 0) {
    throw new RangeError('Cannot calculate square root of negative number');
  }
  return Math.sqrt(n);
}

/**
 * Calculate base raised to the power of exponent
 * @param {number} base - The base number
 * @param {number} exponent - The exponent
 * @returns {number} base^exponent
 */
function power(base, exponent) {
  if (typeof base !== 'number' || typeof exponent !== 'number') {
    throw new TypeError('base and exponent must be valid numbers');
  }
  if (Number.isNaN(base) || Number.isNaN(exponent)) {
    throw new TypeError('base and exponent must be valid numbers');
  }
  return Math.pow(base, exponent);
}

/**
 * Calculate the natural logarithm of a number
 * @param {number} n - The number to find the logarithm of
 * @returns {number} The natural logarithm (base e)
 */
function ln(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError('n must be a valid number');
  }
  if (n <= 0) {
    throw new RangeError('Cannot calculate logarithm of non-positive number');
  }
  return Math.log(n);
}

/**
 * Calculate logarithm with custom base
 * @param {number} base - The logarithm base
 * @param {number} n - The number to find the logarithm of
 * @returns {number} log_base(n)
 */
function logBase(base, n) {
  if (typeof base !== 'number' || typeof n !== 'number') {
    throw new TypeError('base and n must be valid numbers');
  }
  if (Number.isNaN(base) || Number.isNaN(n)) {
    throw new TypeError('base and n must be valid numbers');
  }
  if (n <= 0 || base <= 0 || base === 1) {
    throw new RangeError('Invalid input for logarithm');
  }
  return Math.log(n) / Math.log(base);
}

/**
 * Calculate nth root of a number
 * @param {number} n - The number to find the root of
 * @param {number} root - The root degree
 * @returns {number} The nth root
 */
function nthRoot(n, root) {
  if (typeof n !== 'number' || typeof root !== 'number') {
    throw new TypeError('n and root must be valid numbers');
  }
  if (root === 0) {
    throw new RangeError('Root cannot be zero');
  }
  return Math.pow(n, 1 / root);
}

/**
 * Calculate trigonometric sine
 * @param {number} radians - Angle in radians
 * @returns {number} Sine of the angle
 */
function sin(radians) {
  if (typeof radians !== 'number' || Number.isNaN(radians)) {
    throw new TypeError('radians must be a valid number');
  }
  return Math.sin(radians);
}

/**
 * Calculate trigonometric cosine
 * @param {number} radians - Angle in radians
 * @returns {number} Cosine of the angle
 */
function cos(radians) {
  if (typeof radians !== 'number' || Number.isNaN(radians)) {
    throw new TypeError('radians must be a valid number');
  }
  return Math.cos(radians);
}

/**
 * Calculate trigonometric tangent
 * @param {number} radians - Angle in radians
 * @returns {number} Tangent of the angle
 */
function tan(radians) {
  if (typeof radians !== 'number' || Number.isNaN(radians)) {
    throw new TypeError('radians must be a valid number');
  }
  return Math.tan(radians);
}

// Aliases for backward compatibility
const dtr = degreesToRadians;
const rtd = radiansToDegrees;
const log = ln;

module.exports = {
  degreesToRadians,
  radiansToDegrees,
  sqrt,
  power,
  ln,
  logBase,
  nthRoot,
  sin,
  cos,
  tan,
  // Backward compatibility aliases
  dtr,
  rtd,
  log,
};
