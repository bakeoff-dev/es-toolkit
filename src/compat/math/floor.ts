import { decimalAdjust } from '../_internal/decimalAdjust.ts';

/**
 * Computes number rounded down to precision.
 *
 * `number` is coerced to a number and `precision` to an integer, so values such as
 * `'4.016'`, `true` or `[2]` are accepted. Symbols coerce to `NaN`, and `precision`
 * is capped at `292`.
 *
 * @param number The number to round down.
 * @param precision The precision to round down to.
 * @returns Returns the rounded down number.
 *
 * @example
 * floor(4.006); // => 4
 * floor(0.046, 2); // => 0.04
 * floor(4060, -2); // => 4000
 */
export function floor(number: number, precision = 0): number {
  return decimalAdjust('floor', number, precision);
}
