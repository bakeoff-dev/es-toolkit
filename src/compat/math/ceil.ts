import { decimalAdjust } from '../_internal/decimalAdjust.ts';

/**
 * Computes number rounded up to precision.
 *
 * `number` is coerced to a number and `precision` to an integer, so values such as
 * `'4.016'`, `true` or `[2]` are accepted. Symbols coerce to `NaN`, and `precision`
 * is capped at `292`.
 *
 * @param number The number to round up.
 * @param precision The precision to round up to.
 * @returns Returns the rounded up number.
 *
 * @example
 * ceil(4.006); // => 5
 * ceil(6.004, 2); // => 6.01
 * ceil(6040, -2); // => 6100
 */
export function ceil(number: number, precision = 0): number {
  return decimalAdjust('ceil', number, precision);
}
