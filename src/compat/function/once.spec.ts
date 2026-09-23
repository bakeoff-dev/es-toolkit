import { describe, expect, it } from 'vitest';
import { once } from './once';

describe('once', () => {
  it('should invoke `func` once', () => {
    let count = 0;
    const resultFunc = once(() => ++count);

    expect(resultFunc()).toBe(1);
    expect(count).toBe(1);
  });

  it('should ignore recursive calls', () => {
    let count = 0;

    const resultFunc = once(() => {
      resultFunc();
      return ++count;
    });

    expect(resultFunc()).toBe(1);
    expect(count).toBe(1);
  });

  it('should not throw more than once', () => {
    const resultFunc = once(() => {
      throw new Error();
    });

    expect(resultFunc).toThrow();
    expect(resultFunc).not.toThrow();
  });

  it('should preserve the `this` binding', () => {
    const object = {
      value: 42,
      getValue: once(function (this: { value: number }) {
        return this.value;
      }),
    };

    expect(object.getValue()).toBe(42);
    expect(object.getValue()).toBe(42);
  });

  it('should provide correct `func` arguments', () => {
    let args: unknown[] | undefined;

    const resultFunc = once(function (...params: unknown[]) {
      args = params;
    });

    resultFunc(1, 2, 3);

    expect(args).toEqual([1, 2, 3]);
  });
});
