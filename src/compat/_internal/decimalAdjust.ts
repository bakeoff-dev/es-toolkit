import { toNumber } from '../util/toNumber.ts';

export function decimalAdjust(
  type: 'round' | 'floor' | 'ceil',
  number: number | string,
  precision: number | string = 0
): number {
  number = toNumber(number);
  if (Object.is(number, -0)) {
    number = '-0';
  }
  precision = typeof precision === 'number' || typeof precision === 'boolean'
    ? toNumber(precision)
    : Number.parseInt(String(precision), 10);
  precision = Number.isNaN(precision) ? 0 : Math.min(Math.trunc(precision), 292);
  if (precision && Number.isFinite(Number(number))) {
    const [magnitude, exponent = 0] = number.toString().split('e');
    let adjustedValue: string | number = Math[type](Number(`${magnitude}e${Number(exponent) + precision}`));
    if (Object.is(adjustedValue, -0)) {
      adjustedValue = '-0';
    }
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e');
    return Number(`${newMagnitude}e${Number(newExponent) - precision}`);
  }
  return Math[type](Number(number));
}
