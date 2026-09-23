import { before } from './before.ts';

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to
 * the function return the value of the first invocation.
 *
 * @template T - The type of the function.
 * @param func - The function to restrict.
 * @returns Returns the new restricted function.
 *
 * @example
 * const initialize = once(createApplication);
 *
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */
export function once<T extends (...args: any) => any>(func: T): T {
  return before(2, func);
}
