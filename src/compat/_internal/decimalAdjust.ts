import { toInteger } from '../util/toInteger.ts';
import { toNumber } from '../util/toNumber.ts';

export function decimalAdjust(
  type: 'round' | 'floor' | 'ceil',
  number: unknown,
  precision: unknown = 0
): number {
  number = toNumber(number);
  if (Object.is(number, -0)) {
    number = '-0';
  }
  precision = precision == null ? 0 : Math.min(toInteger(precision), 292);
  if (precision && Number.isFinite(number)) {
    const [magnitude, exponent = 0] = number.toString().split('e');
    let adjustedValue: string | number = Math[type](Number(`${magnitude}e${Number(exponent) + precision}`));
    if (Object.is(adjustedValue, -0)) {
      adjustedValue = '-0';
    }
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e');
    return Number(`${newMagnitude}e${Number(newExponent) - precision}`);
  }
  return Math[type](number);
}
