import { describe, expect, it } from 'vitest';
import { minBy } from './minBy';

describe('minBy', () => {
  it('minBy selects one min value in array', () => {
    const people = [
      { name: 'Mark', age: 30 },
      { name: 'Nunu', age: 20 },
      { name: 'Overmars', age: 35 },
    ];
    const result = minBy(people, person => person.age);
    expect(result).toEqual({ name: 'Nunu', age: 20 });
  });

  it('if there are two min values, first one is selected', () => {
    const people = [
      { name: 'Mark', age: 30 },
      { name: 'Nunu', age: 20 },
      { name: 'Overmars', age: 20 },
    ];
    const result = minBy(people, person => person.age);
    expect(result).toEqual({ name: 'Nunu', age: 20 });
  });

  it('if array is single-element, return unique element of array', () => {
    const people = [{ name: 'Mark', age: 25 }];
    const result = minBy(people, person => person.age);
    expect(result).toEqual({ name: 'Mark', age: 25 });
  });

  it('if array is empty, return undefined', () => {
    type Person = { name: string; age: number };
    const people: Person[] = [];
    const result = minBy(people, person => person.age);
    expect(result).toBeUndefined();
  });

  it('should propagate NaN regardless of its position, matching Math.min', () => {
    expect(minBy([Number.NaN, 3, 1, 2], x => x)).toBeNaN();
    expect(minBy([3, Number.NaN, 1, 2], x => x)).toBeNaN();
    expect(minBy([3, 1, 2, Number.NaN], x => x)).toBeNaN();
  });

  it('should provide index parameter to getValue function', () => {
    const items = [{ value: 10 }, { value: 20 }, { value: 15 }];
    const result = minBy(items, (item, index) => item.value + index);
    expect(result).toEqual({ value: 10 });
  });

  it('should provide array parameter to getValue function', () => {
    const items = [{ value: 10 }, { value: 20 }, { value: 15 }];
    const result = minBy(items, (item, _index, array) => item.value * array.length);
    expect(result).toEqual({ value: 10 });
  });
  it('should compare non-numeric values with `<` instead of falling back to the first element', () => {
    const versions = [{ version: 'c' }, { version: 'a' }, { version: 'b' }];

    // The type signature documents numeric values, but comparison is relational,
    // so any value comparable with `<` works at runtime.
    const getVersion = (item: { version: string }) => item.version as unknown as number;

    expect(minBy(versions, getVersion)).toEqual({ version: 'a' });
    expect(minBy([{ version: 'b' }, { version: 'c' }], getVersion)).toEqual({ version: 'b' });
  });

  it('should return the first element among equal non-numeric values', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'a' },
      { id: 3, name: 'b' },
    ];

    const result = minBy(items, item => item.name as unknown as number);

    expect(result).toBe(items[0]);
  });

  it('should work with values that are all above zero', () => {
    expect(minBy([3, 1, 2], x => x)).toBe(1);
    expect(minBy([{ a: Infinity }, { a: 5 }], x => x.a)).toEqual({ a: 5 });
  });
});
