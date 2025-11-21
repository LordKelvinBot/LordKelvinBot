/**
 * Tests for mathUtils module
 */

'use strict';

const {
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
  dtr,
  rtd,
} = require('../utils/mathUtils');

describe('mathUtils', () => {
  describe('degreesToRadians', () => {
    test('converts 0 degrees to 0 radians', () => {
      expect(degreesToRadians(0)).toBe(0);
    });

    test('converts 90 degrees to PI/2 radians', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
    });

    test('converts 180 degrees to PI radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
    });

    test('converts 360 degrees to 2*PI radians', () => {
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
    });

    test('converts negative degrees correctly', () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2);
    });

    test('throws TypeError for non-number input', () => {
      expect(() => degreesToRadians('90')).toThrow(TypeError);
      expect(() => degreesToRadians(null)).toThrow(TypeError);
      expect(() => degreesToRadians(NaN)).toThrow(TypeError);
    });

    test('dtr is an alias for degreesToRadians', () => {
      expect(dtr(90)).toBeCloseTo(degreesToRadians(90));
    });
  });

  describe('radiansToDegrees', () => {
    test('converts 0 radians to 0 degrees', () => {
      expect(radiansToDegrees(0)).toBe(0);
    });

    test('converts PI/2 radians to 90 degrees', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
    });

    test('converts PI radians to 180 degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
    });

    test('converts 2*PI radians to 360 degrees', () => {
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
    });

    test('throws TypeError for non-number input', () => {
      expect(() => radiansToDegrees('3.14')).toThrow(TypeError);
    });

    test('rtd is an alias for radiansToDegrees', () => {
      expect(rtd(Math.PI)).toBeCloseTo(radiansToDegrees(Math.PI));
    });
  });

  describe('sqrt', () => {
    test('calculates square root of 0', () => {
      expect(sqrt(0)).toBe(0);
    });

    test('calculates square root of 4', () => {
      expect(sqrt(4)).toBe(2);
    });

    test('calculates square root of 9', () => {
      expect(sqrt(9)).toBe(3);
    });

    test('calculates square root of 2', () => {
      expect(sqrt(2)).toBeCloseTo(1.414, 3);
    });

    test('throws TypeError for non-number input', () => {
      expect(() => sqrt('4')).toThrow(TypeError);
    });

    test('throws RangeError for negative input', () => {
      expect(() => sqrt(-1)).toThrow(RangeError);
    });
  });

  describe('power', () => {
    test('calculates 2^3', () => {
      expect(power(2, 3)).toBe(8);
    });

    test('calculates 10^0', () => {
      expect(power(10, 0)).toBe(1);
    });

    test('calculates 5^1', () => {
      expect(power(5, 1)).toBe(5);
    });

    test('calculates 2^-1', () => {
      expect(power(2, -1)).toBe(0.5);
    });

    test('throws TypeError for non-number inputs', () => {
      expect(() => power('2', 3)).toThrow(TypeError);
      expect(() => power(2, '3')).toThrow(TypeError);
    });
  });

  describe('ln', () => {
    test('calculates ln(1)', () => {
      expect(ln(1)).toBe(0);
    });

    test('calculates ln(e)', () => {
      expect(ln(Math.E)).toBeCloseTo(1);
    });

    test('calculates ln(e^2)', () => {
      expect(ln(Math.E * Math.E)).toBeCloseTo(2);
    });

    test('throws TypeError for non-number input', () => {
      expect(() => ln('1')).toThrow(TypeError);
    });

    test('throws RangeError for non-positive input', () => {
      expect(() => ln(0)).toThrow(RangeError);
      expect(() => ln(-1)).toThrow(RangeError);
    });
  });

  describe('logBase', () => {
    test('calculates log base 10 of 100', () => {
      expect(logBase(10, 100)).toBeCloseTo(2);
    });

    test('calculates log base 2 of 8', () => {
      expect(logBase(2, 8)).toBeCloseTo(3);
    });

    test('calculates log base 5 of 125', () => {
      expect(logBase(5, 125)).toBeCloseTo(3);
    });

    test('throws RangeError for invalid inputs', () => {
      expect(() => logBase(1, 10)).toThrow(RangeError);
      expect(() => logBase(10, 0)).toThrow(RangeError);
      expect(() => logBase(-2, 8)).toThrow(RangeError);
    });
  });

  describe('nthRoot', () => {
    test('calculates cube root of 27', () => {
      expect(nthRoot(27, 3)).toBeCloseTo(3);
    });

    test('calculates square root of 16', () => {
      expect(nthRoot(16, 2)).toBeCloseTo(4);
    });

    test('calculates 4th root of 16', () => {
      expect(nthRoot(16, 4)).toBeCloseTo(2);
    });

    test('throws RangeError for root of 0', () => {
      expect(() => nthRoot(8, 0)).toThrow(RangeError);
    });
  });

  describe('trigonometric functions', () => {
    test('sin(0) equals 0', () => {
      expect(sin(0)).toBe(0);
    });

    test('sin(PI/2) equals 1', () => {
      expect(sin(Math.PI / 2)).toBeCloseTo(1);
    });

    test('cos(0) equals 1', () => {
      expect(cos(0)).toBe(1);
    });

    test('cos(PI) equals -1', () => {
      expect(cos(Math.PI)).toBeCloseTo(-1);
    });

    test('tan(0) equals 0', () => {
      expect(tan(0)).toBe(0);
    });

    test('tan(PI/4) equals 1', () => {
      expect(tan(Math.PI / 4)).toBeCloseTo(1);
    });

    test('trig functions throw TypeError for non-number input', () => {
      expect(() => sin('0')).toThrow(TypeError);
      expect(() => cos(null)).toThrow(TypeError);
      expect(() => tan(undefined)).toThrow(TypeError);
    });
  });
});
