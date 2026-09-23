import { describe, expect, it } from 'vitest';
import { floor } from './floor';

describe('floor', () => {
  it(`\`floor\` should return a rounded number without a precision`, () => {
    const actual = floor(4.006);
    expect(actual).toBe(4);
  });

  it(`\`floor\` should work with a precision of \`0\``, () => {
    const actual = floor(4.006, 0);
    expect(actual).toBe(4);
  });

  it(`\`floor\` should work with a positive precision`, () => {
    let actual = floor(4.016, 2);
    expect(actual).toBe(4.01);

    actual = floor(4.1, 2);
    expect(actual).toBe(4.1);

    actual = floor(4.4, 2);
    expect(actual).toBe(4.4);
  });

  it(`\`floor\` should work with a negative precision`, () => {
    const actual = floor(4160, -2);
    expect(actual).toBe(4100);
  });

  it(`\`floor\` should coerce \`precision\` to an integer`, () => {
    let actual = floor(4.006, NaN);
    expect(actual).toBe(4);

    const expected = 4.01;

    actual = floor(4.016, 2.6);
    expect(actual).toBe(expected);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = floor(4.016, '+2');
    expect(actual).toBe(expected);
  });

  it(`\`floor\` should work with exponential notation and \`precision\``, () => {
    let actual = floor(5e1, 2);
    expect(actual).toEqual(50);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = floor('5e', 1);
    expect(actual).toEqual(NaN);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    actual = floor('5e1e1', 1);
    expect(actual).toEqual(NaN);
  });

  it(`\`floor\` should preserve the sign of \`0\``, () => {
    const values = [[0], [-0], ['0'], ['-0'], [0, 1], [-0, 1], ['0', 1], ['-0', 1]];
    const expected = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];

    // eslint-disable-next-line prefer-spread
    const actual = values.map(args => 1 / floor.apply(undefined, args as any));

    expect(actual).toEqual(expected);
  });

  it(`\`floor\` should return \`Infinity\` for infinite values regardless of \`precision\``, () => {
    expect(floor(Infinity)).toBe(Infinity);
    expect(floor(Infinity, 2)).toBe(Infinity);
    expect(floor(-Infinity, 2)).toBe(-Infinity);
    expect(floor(Infinity, -2)).toBe(Infinity);
    expect(floor(-Infinity, -2)).toBe(-Infinity);
  });

  it(`\`floor\` should handle edge cases`, () => {
    expect(floor(1.797, 295)).toBe(1.797);
    expect(floor(1.797, -295)).toBe(0);
    expect(floor(1.792e-295, 295)).toBe(0);
    expect(floor(1.792e295, -295)).toBe(1e295);
    expect(floor(1.7976931348623157e308, 292)).toBe(NaN);
    expect(floor(5e-324, 323)).toBe(0);
    expect(floor(5e-324, -323)).toBe(0);
  });

  it(`\`floor\` should coerce \`precision\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number]> = [
      [true, 4],
      [false, 4],
      [Infinity, 4.016],
      [[1, 2, 3], 4],
      [[2], 4.01],
      ['1e3', 4.016],
      ['2px', 4],
      ['0x2', 4.01],
      ['-0x2', 4],
      [null, 4],
      [undefined, 4],
      [NaN, 4],
      [' 2 ', 4.01],
      [{ valueOf: () => 2 }, 4.01],
      [symbol, 4],
      ['3.7', 4.016],
      [-1.5, 0],
    ];

    for (const [precision, expected] of cases) {
      expect(floor(4.016, precision as number)).toBe(expected);
    }
  });

  it(`\`floor\` should coerce \`number\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number, number]> = [
      ['4.016', 4, 4.01],
      [' 4.016 ', 4, 4.01],
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
      [[4.6], 4, 4.6],
      [[], 0, 0],
      [{ valueOf: () => 4.6 }, 4, 4.6],
      [symbol, NaN, NaN],
      ['5e1', 50, 50],
    ];

    for (const [value, expected, expectedWithPrecision] of cases) {
      expect(floor(value as number)).toBe(expected);
      expect(floor(value as number, 2)).toBe(expectedWithPrecision);
    }
  });
});
