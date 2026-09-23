import { describe, expect, it } from 'vitest';
import { minBy } from './minBy';

describe('minBy', () => {
  it('should work with Date objects', () => {
    const curr = new Date();
    const past = new Date(0);

    expect(minBy([curr, past], date => date.getTime())).toBe(past);
  });

  it('should work with extremely large arrays', () => {
    const array = Array.from({ length: 5e5 }, (_, i) => i);
    expect(minBy(array, x => x)).toBe(0);
  });

  it('should work when chaining on an array with only one value', () => {
    const array = [40];
    expect(minBy(array, x => x)).toBe(40);
  });

  const array = [1, 2, 3];

  it('should work with an `iteratee`', () => {
    const actual = minBy(array, n => -n);
    expect(actual).toBe(3);
  });

  it('should work with `_.property` shorthands', () => {
    const objects = [{ a: 2 }, { a: 3 }, { a: 1 }];
    expect(minBy(objects, 'a')).toEqual(objects[2]);

    const arrays = [[2], [3], [1]];
    expect(minBy(arrays, 0)).toEqual(arrays[2]);
  });

  it('should work when `iteratee` returns +/-Infinity', () => {
    const value = -Infinity;
    const object = { a: value };

    const actual = minBy([object, { a: value }], obj => obj.a);
    expect(actual).toBe(object);
  });

  it('should handle null and undefined values', () => {
    expect(minBy(null)).toBe(undefined);
    expect(minBy(undefined)).toBe(undefined);
  });

  it('should work without iteratee parameter (default to identity)', () => {
    const numbers = [3, 1, 2];

    expect(minBy(numbers)).toBe(1);
  });
  it('should work with string values, matching lodash', () => {
    expect(minBy([{ v: 'b' }, { v: 'a' }, { v: 'c' }], o => o.v)).toEqual({ v: 'a' });
    expect(minBy([{ v: 'a' }, { v: 'b' }, { v: 'c' }], o => o.v)).toEqual({ v: 'a' });
    expect(minBy(['1.2.0', '1.10.0', '1.9.0'], v => v)).toBe('1.10.0');
  });

  it('should work with string values and `_.property` shorthands', () => {
    const objects = [{ v: 'b' }, { v: 'a' }, { v: 'c' }];
    expect(minBy(objects, 'v')).toBe(objects[1]);
  });

  it('should work with boolean values, matching lodash', () => {
    expect(minBy([{ v: true }, { v: false }], o => o.v)).toEqual({ v: false });
  });

  it('should return the first element among equal string values', () => {
    const objects = [
      { i: 1, v: 'a' },
      { i: 2, v: 'a' },
      { i: 3, v: 'b' },
    ];
    expect(minBy(objects, o => o.v)).toBe(objects[0]);
  });
});
