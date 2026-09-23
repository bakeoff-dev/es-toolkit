import { describe, expect, it } from 'vitest';
import { ceil } from './ceil';

describe('ceil', () => {
  it(`\`ceil\` should return a rounded number without a precision`, () => {
    const actual = ceil(4.006);
    expect(actual).toBe(5);
  });

  it(`\`ceil\` should work with a precision of \`0\``, () => {
    const actual = ceil(4.006, 0);
    expect(actual).toBe(5);
  });

  it(`\`ceil\` should work with a positive precision`, () => {
    let actual = ceil(4.016, 2);
    expect(actual).toBe(4.02);

    actual = ceil(4.1, 2);
    expect(actual).toBe(4.1);

    actual = ceil(4.4, 2);
    expect(actual).toBe(4.4);
  });

  it(`\`ceil\` should work with a negative precision`, () => {
    const actual = ceil(4160, -2);
    expect(actual).toBe(4200);
  });

  it(`\`ceil\` should coerce \`precision\` to an integer`, () => {
    let actual = ceil(4.006, NaN);
    expect(actual).toBe(5);

    const expected = 4.02;

    actual = ceil(4.016, 2.6);
    expect(actual).toBe(expected);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = ceil(4.016, '+2');
    expect(actual).toBe(expected);
  });

  it(`\`ceil\` should work with exponential notation and \`precision\``, () => {
    let actual = ceil(5e1, 2);
    expect(actual).toEqual(50);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = ceil('5e', 1);
    expect(actual).toEqual(NaN);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = ceil('5e1e1', 1);
    expect(actual).toEqual(NaN);
  });

  it(`\`ceil\` should preserve the sign of \`0\``, () => {
    const values = [[0], [-0], ['0'], ['-0'], [0, 1], [-0, 1], ['0', 1], ['-0', 1]];
    const expected = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];

    // eslint-disable-next-line prefer-spread
    const actual = values.map(args => 1 / ceil.apply(undefined, args as any));

    expect(actual).toEqual(expected);
  });

  it(`\`ceil\` should return \`Infinity\` for infinite values regardless of \`precision\``, () => {
    expect(ceil(Infinity)).toBe(Infinity);
    expect(ceil(Infinity, 2)).toBe(Infinity);
    expect(ceil(-Infinity, 2)).toBe(-Infinity);
    expect(ceil(Infinity, -2)).toBe(Infinity);
    expect(ceil(-Infinity, -2)).toBe(-Infinity);
  });

  it(`\`ceil\` should handle edge cases`, () => {
    expect(ceil(1.797, 295)).toBe(1.797);
    expect(ceil(1.797, -295)).toBe(1e295);
    expect(ceil(1.792e-295, 295)).toBe(1e-292);
    expect(ceil(1.792e295, -295)).toBe(2e295);
    expect(ceil(1.7976931348623157e308, 292)).toBe(NaN);
    expect(ceil(5e-324, 323)).toBe(1e-292);
    expect(ceil(5e-324, -323)).toBe(0);
  });

  it(`\`ceil\` should coerce \`precision\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number]> = [
      [true, 4.1],
      [false, 5],
      [Infinity, 4.016],
      [[1, 2, 3], 5],
      [[2], 4.02],
      ['1e3', 4.016],
      ['2px', 5],
      ['0x2', 4.02],
      ['-0x2', 5],
      [null, 5],
      [undefined, 5],
      [NaN, 5],
      [' 2 ', 4.02],
      [{ valueOf: () => 2 }, 4.02],
      [symbol, 5],
      ['3.7', 4.016],
      [-1.5, 10],
    ];

    for (const [precision, expected] of cases) {
      expect(ceil(4.016, precision as number)).toBe(expected);
    }
  });

  it(`\`ceil\` should coerce \`number\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number, number]> = [
      ['4.016', 5, 4.02],
      [' 4.016 ', 5, 4.02],
      ['0x20', 32, 32],
      ['0b101', 5, 5],
      ['0o17', 15, 15],
      ['-0x2', NaN, NaN],
      [true, 1, 1],
      [false, 0, 0],
      [null, 0, 0],
      [undefined, NaN, NaN],
      ['', 0, 0],
      [' ', 0, 0],
      [[4.6], 5, 4.6],
      [[], 0, 0],
      [{ valueOf: () => 4.6 }, 5, 4.6],
      [symbol, NaN, NaN],
      ['5e1', 50, 50],
    ];

    for (const [value, expected, expectedWithPrecision] of cases) {
      expect(ceil(value as number)).toBe(expected);
      expect(ceil(value as number, 2)).toBe(expectedWithPrecision);
    }
  });
});
