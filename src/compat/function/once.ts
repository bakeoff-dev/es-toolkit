/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the created function return the value of the first invocation.
 *
 * @template T - The type of the function.
 * @param func - The function to restrict.
 * @returns Returns the new restricted function.
 */
export function once<T extends (...args: any) => any>(func: T): T {
  let called = false;
  let cache: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      cache = func.apply(this, args);
    }

    return cache;
  } as T;
}
