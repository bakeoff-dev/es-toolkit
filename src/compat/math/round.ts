import { decimalAdjust } from '../_internal/decimalAdjust.ts';

/**
 * Computes number rounded to precision.
 *
 * `number` is coerced to a number and `precision` to an integer, so values such as
 * `'4.016'`, `true` or `[2]` are accepted. Symbols coerce to `NaN`, and `precision`
 * is capped at `292`.
 *
 * @param number  The number to round.
 * @param precision The precision to round to.
 * @returns Returns the rounded number.
 *
 * @example
 * round(4.006); // => 4
 * round(4.006, 2); // => 4.01
 * round(4060, -2); // => 4100
 */
export function round(number: number, precision = 0): number {
  return decimalAdjust('round', number, precision);
}
