import { describe, expect, it, vi } from 'vitest';
import { once } from './once';

// adjust the import path as necessary

describe('once', () => {
  it('should call the function only once', () => {
    const func = vi.fn(() => 42);
    const onceFunc = once(func);

    expect(onceFunc()).toBe(42);
    expect(onceFunc()).toBe(42);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should work with functions returning undefined', () => {
    const func = vi.fn(() => undefined);
    const onceFunc = once(func);

    expect(onceFunc()).toBeUndefined();
    expect(onceFunc()).toBeUndefined();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should preserve the `this` binding of the caller', () => {
    const object = {
      value: 42,
      getValue: once(function (this: { value: number }) {
        return this.value;
      }),
    };

    expect(object.getValue()).toBe(42);
    expect(object.getValue()).toBe(42);
  });

  it('should pass arguments to `func`', () => {
    const func = vi.fn((a: number, b: number) => a + b);
    const onceFunc = once(func);

    expect(onceFunc(1, 2)).toBe(3);
    expect(onceFunc(3, 4)).toBe(3);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 2);
  });

  it('should handle functions with no return value', () => {
    const func = vi.fn(() => {
      console.log('Side effect');
    });
    const onceFunc = once(func);

    expect(onceFunc()).toBeUndefined();
    expect(onceFunc()).toBeUndefined();
    expect(func).toHaveBeenCalledTimes(1);
  });
});
