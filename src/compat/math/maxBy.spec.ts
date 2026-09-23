import { describe, expect, it } from 'vitest';
import { maxBy } from './maxBy';

describe('maxBy', () => {
  it('should work with Date objects', () => {
    const curr = new Date();
    const past = new Date(0);

    expect(maxBy([curr, past], date => date.getTime())).toBe(curr);
  });

  it('should work with extremely large arrays', () => {
    const array = Array.from({ length: 5e5 }, (_, i) => i);
    expect(maxBy(array, x => x)).toBe(499999);
  });

  it('should work when chaining on an array with only one value', () => {
    const array = [40];
    expect(maxBy(array, x => x)).toBe(40);
  });

  const array = [1, 2, 3];

  it('should work with an `iteratee`', () => {
    const actual = maxBy(array, n => -n);
    expect(actual).toBe(1);
  });

  it('should work with `_.property` shorthands', () => {
    const objects = [{ a: 2 }, { a: 3 }, { a: 1 }];
    expect(maxBy(objects, 'a')).toEqual(objects[1]);

    const arrays = [[2], [3], [1]];
    expect(maxBy(arrays, 0)).toEqual(arrays[1]);
  });

  it('should work when `iteratee` returns +/-Infinity', () => {
    const value = -Infinity;
    const object = { a: value };

    const actual = maxBy([object, { a: value }], obj => obj.a);
    expect(actual).toBe(object);
  });

  it('should handle null and undefined values', () => {
    expect(maxBy(null)).toBe(undefined);
    expect(maxBy(undefined)).toBe(undefined);
  });

  it('should work without iteratee parameter (default to identity)', () => {
    const numbers = [1, 2, 3];

    expect(maxBy(numbers)).toBe(3);
  });
  it('should work with string values, matching lodash', () => {
    expect(maxBy([{ v: 'a' }, { v: 'b' }, { v: 'c' }], o => o.v)).toEqual({ v: 'c' });
    expect(maxBy([{ v: 'c' }, { v: 'a' }, { v: 'b' }], o => o.v)).toEqual({ v: 'c' });
    expect(maxBy(['1.2.0', '1.10.0', '1.9.0'], v => v)).toBe('1.9.0');
  });

  it('should work with string values and `_.property` shorthands', () => {
    const objects = [{ v: 'a' }, { v: 'c' }, { v: 'b' }];
    expect(maxBy(objects, 'v')).toBe(objects[1]);
  });

  it('should work with boolean values, matching lodash', () => {
    expect(maxBy([{ v: false }, { v: true }], o => o.v)).toEqual({ v: true });
  });

  it('should return the first element among equal string values', () => {
    const objects = [
      { i: 1, v: 'b' },
      { i: 2, v: 'b' },
      { i: 3, v: 'a' },
    ];
    expect(maxBy(objects, o => o.v)).toBe(objects[0]);
  });
});
