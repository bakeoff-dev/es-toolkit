import { describe, expect, it } from 'vitest';
import { round } from './round';

describe('round', () => {
  it(`\`round\` should return a rounded number without a precision`, () => {
    const actual = round(4.006);
    expect(actual).toBe(4);
  });

  it(`\`round\` should work with a precision of \`0\``, () => {
    const actual = round(4.006, 0);
    expect(actual).toBe(4);
  });

  it(`\`round\` should work with a positive precision`, () => {
    let actual = round(4.016, 2);
    expect(actual).toBe(4.02);

    actual = round(4.1, 2);
    expect(actual).toBe(4.1);

    actual = round(4.4, 2);
    expect(actual).toBe(4.4);
  });

  it(`\`round\` should work with a negative precision`, () => {
    const actual = round(4160, -2);
    expect(actual).toBe(4200);
  });

  it(`\`round\` should coerce \`precision\` to an integer`, () => {
    let actual = round(4.006, NaN);
    expect(actual).toBe(4);

    const expected = 4.02;

    actual = round(4.016, 2.6);
    expect(actual).toBe(expected);

    // @ts-expect-error - Invalid arguments
    actual = round(4.016, '+2');
    expect(actual).toBe(expected);
  });

  it(`\`round\` should work with exponential notation and \`precision\``, () => {
    let actual = round(5e1, 2);
    expect(actual).toEqual(50);

    // @ts-expect-error - Invalid arguments
    actual = round('5e', 1);
    expect(actual).toEqual(NaN);

    // @ts-expect-error - Invalid arguments
    actual = round('5e1e1', 1);
    expect(actual).toEqual(NaN);
  });

  it(`\`round\` should preserve the sign of \`0\``, () => {
    const values = [[0], [-0], ['0'], ['-0'], [0, 1], [-0, 1], ['0', 1], ['-0', 1]];
    const expected = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];

    // eslint-disable-next-line prefer-spread
    const actual = values.map(args => 1 / round.apply(undefined, args as any));

    expect(actual).toEqual(expected);
  });

  it(`\`round\` should not return \`NaN\` for large \`precision\` values`, () => {
    const results = [round(10.0000001, 1000), round(Number.MAX_SAFE_INTEGER, 293)];

    const expected = results.map(() => false);
    const actual = results.map(Number.isNaN);

    expect(actual).toEqual(expected);
  });

  it(`\`round\` should return \`Infinity\` for infinite values regardless of \`precision\``, () => {
    expect(round(Infinity)).toBe(Infinity);
    expect(round(Infinity, 2)).toBe(Infinity);
    expect(round(-Infinity, 2)).toBe(-Infinity);
    expect(round(Infinity, -2)).toBe(Infinity);
    expect(round(-Infinity, -2)).toBe(-Infinity);
  });

  it(`\`round\` should handle edge cases`, () => {
    expect(round(1.797, 295)).toBe(1.797);
    expect(round(1.797, -295)).toBe(0);
    expect(round(1.792e-295, 295)).toBe(0);
    expect(round(1.792e295, -295)).toBe(2e295);
    expect(round(1.7976931348623157e308, 292)).toBe(NaN);
    expect(round(5e-324, 323)).toBe(0);
    expect(round(5e-324, -323)).toBe(0);
  });

  it(`\`round\` should coerce \`precision\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number]> = [
      [true, 4],
      [false, 4],
      [Infinity, 4.016],
      [[1, 2, 3], 4],
      [[2], 4.02],
      ['1e3', 4.016],
      ['2px', 4],
      ['0x2', 4.02],
      ['-0x2', 4],
      [null, 4],
      [undefined, 4],
      [NaN, 4],
      [' 2 ', 4.02],
      [{ valueOf: () => 2 }, 4.02],
      [symbol, 4],
      ['3.7', 4.016],
      [-1.5, 0],
    ];

    for (const [precision, expected] of cases) {
      expect(round(4.016, precision as number)).toBe(expected);
    }
  });

  it(`\`round\` should coerce \`number\` the same way lodash does`, () => {
    const symbol = Symbol('a');
    const cases: Array<[unknown, number, number]> = [
      ['4.016', 4, 4.02],
      [' 4.016 ', 4, 4.02],
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
      expect(round(value as number)).toBe(expected);
      expect(round(value as number, 2)).toBe(expectedWithPrecision);
    }
  });
});
