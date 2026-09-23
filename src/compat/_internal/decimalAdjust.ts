import { toInteger } from '../util/toInteger.ts';
import { toNumber } from '../util/toNumber.ts';

export function decimalAdjust(type: 'round' | 'floor' | 'ceil', number: unknown, precision: unknown = 0): number {
  const numericNumber = toNumber(number);
  const numericPrecision = precision == null ? 0 : Math.min(toInteger(precision), 292);

  if (numericPrecision && Number.isFinite(numericNumber)) {
    let numberStr = numericNumber.toString();
    if (Object.is(numericNumber, -0)) {
      numberStr = '-0';
    }
    const [magnitude, exponent = 0] = numberStr.split('e');
    let adjustedValue: string | number = Math[type](Number(`${magnitude}e${Number(exponent) + numericPrecision}`));
    if (Object.is(adjustedValue, -0)) {
      adjustedValue = '-0';
    }
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e');
    return Number(`${newMagnitude}e${Number(newExponent) - numericPrecision}`);
  }
  return Math[type](numericNumber);
}
