import { once as onceToolkit } from '../../function/once.ts';

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function
 * return the value of the first invocation. `func` is invoked with the `this` binding and
 * arguments of the created function.
 *
 * @template T - The type of the function.
 * @param func - The function to restrict.
 * @returns A new function that invokes `func` once and caches the result.
 *
 * @example
 * let count = 0;
 * const initialize = once(() => ++count);
 *
 * initialize(); // => 1
 * initialize(); // => 1
 *
 * @example
 * const counter = {
 *   count: 0,
 *   increment: once(function (this: { count: number }) {
 *     return ++this.count;
 *   }),
 * };
 *
 * counter.increment(); // => 1
 * counter.increment(); // => 1
 */
export function once<T extends (...args: any) => any>(func: T): T {
  return onceToolkit(func);
}
