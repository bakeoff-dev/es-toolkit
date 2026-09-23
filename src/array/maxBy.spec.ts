import { describe, expect, it } from 'vitest';
import { maxBy } from './maxBy';

describe('maxBy', () => {
  it('maxBy selects one max value in array', () => {
    const people = [
      { name: 'Mark', age: 25 },
      { name: 'Nunu', age: 30 },
      { name: 'Overmars', age: 20 },
    ];
    const result = maxBy(people, person => person.age);
    expect(result).toEqual({ name: 'Nunu', age: 30 });
  });

  it('if there are two max values, first one is selected', () => {
    const people = [
      { name: 'Mark', age: 25 },
      { name: 'Nunu', age: 30 },
      { name: 'Overmars', age: 30 },
    ];
    const result = maxBy(people, person => person.age);
    expect(result).toEqual({ name: 'Nunu', age: 30 });
  });

  it('if array is single-element, return unique element of array', () => {
    const people = [{ name: 'Mark', age: 25 }];
    const result = maxBy(people, person => person.age);
    expect(result).toEqual({ name: 'Mark', age: 25 });
  });

  it('if array is empty, return undefined', () => {
    type Person = { name: string; age: number };
    const people: Person[] = [];
    const result = maxBy(people, person => person.age);
    expect(result).toBeUndefined();
  });

  it('should propagate NaN regardless of its position, matching Math.max', () => {
    expect(maxBy([Number.NaN, 1, 3, 2], x => x)).toBeNaN();
    expect(maxBy([1, Number.NaN, 3, 2], x => x)).toBeNaN();
    expect(maxBy([1, 3, 2, Number.NaN], x => x)).toBeNaN();
  });

  it('should provide index parameter to getValue function', () => {
    const items = [{ value: 10 }, { value: 20 }, { value: 15 }];
    const result = maxBy(items, (item, index) => item.value + index);
    expect(result).toEqual({ value: 20 });
  });

  it('should provide array parameter to getValue function', () => {
    const items = [{ value: 10 }, { value: 20 }, { value: 15 }];
    const result = maxBy(items, (item, _index, array) => item.value * array.length);
    expect(result).toEqual({ value: 20 });
  });
  it('should compare non-numeric values with `>` instead of falling back to the first element', () => {
    const versions = [{ version: 'a' }, { version: 'c' }, { version: 'b' }];

    // The type signature documents numeric values, but comparison is relational,
    // so any value comparable with `>` works at runtime.
    const getVersion = (item: { version: string }) => item.version as unknown as number;

    expect(maxBy(versions, getVersion)).toEqual({ version: 'c' });
    expect(maxBy([{ version: 'b' }, { version: 'a' }], getVersion)).toEqual({ version: 'b' });
  });

  it('should return the first element among equal non-numeric values', () => {
    const items = [
      { id: 1, name: 'b' },
      { id: 2, name: 'b' },
      { id: 3, name: 'a' },
    ];

    const result = maxBy(items, item => item.name as unknown as number);

    expect(result).toBe(items[0]);
  });

  it('should work with values that are all below zero', () => {
    expect(maxBy([-3, -1, -2], x => x)).toBe(-1);
    expect(maxBy([{ a: -Infinity }, { a: -5 }], x => x.a)).toEqual({ a: -5 });
  });
});
