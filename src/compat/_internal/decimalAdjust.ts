import { toInteger } from '../util/toInteger.ts';
import { toNumber } from '../util/toNumber.ts';

/**
 * Converts a number to a string, preserving the sign of `-0`.
 *
 * `String(-0)` yields `'0'`, which would lose the sign once the value is
 * re-parsed from exponential notation.
 */
function toSignedString(value: number): string {
  return Object.is(value, -0) ? '-0' : String(value);
}

/**
 * Rounds `number` to `precision` decimal places using the given rounding mode.
 *
 * `number` is coerced with `toNumber` and `precision` with `toInteger`, matching how
 * lodash coerces the arguments of `ceil`, `floor` and `round`. `precision` is capped
 * at `292`, the largest precision that can be represented.
 *
 * @param type - The rounding mode to apply.
 * @param number - The value to round.
 * @param precision - The precision to round to.
 * @returns Returns the rounded number.
 */
export function decimalAdjust(type: 'round' | 'floor' | 'ceil', number: unknown, precision: unknown = 0): number {
  const value = toNumber(number);
  const adjustedPrecision = Math.min(toInteger(precision), 292);

  if (adjustedPrecision && Number.isFinite(value)) {
    // Shift with exponential notation to avoid floating-point issues.
    const [magnitude, exponent = '0'] = toSignedString(value).split('e');
    const shifted = Math[type](Number(`${magnitude}e${Number(exponent) + adjustedPrecision}`));
    const [newMagnitude, newExponent = '0'] = toSignedString(shifted).split('e');

    return Number(`${newMagnitude}e${Number(newExponent) - adjustedPrecision}`);
  }

  return Math[type](value);
}
