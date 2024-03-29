import ReThrownError from './Errors.shared/ReThrownError';

/**
 * An Function type return Promise of T, and if T is PromiseFunction, then it return T's return type;
 * @example
 * PromiseFunction<PromiseFunction<T>> = PromiseFunction<T>
 */
type AwaitableFunction<T, P extends unknown[]> = (...args: P) => Promise<T> | T;

export interface ResultTrait<T> {
  /**
   * Unpack the Result, and if there is error, then throw new Error
   */
  readonly expect: (error?: string) => T;
}

type ResultOK<T> = readonly [value: T, error: undefined] & ResultTrait<T>;
type ResultError<E = Error> = readonly [value: undefined, error: E] &
  ResultTrait<never>;

export type Result<T, E = Error> = ResultOK<T> | ResultError<E>;

export type PromiseResult<T, E = Error> = Promise<Result<Awaited<T>, E>>;

function createPromise<T, E extends Error = Error>() {
  let ok: (value: T) => void, err: (err: E) => void;
  const p = new Promise<T>((r, j) => {
    ok = r;
    err = j;
  });
  return [p, ok!, err!] as const;
}

function Ok<T>(value: T): ResultOK<T> {
  return Object.assign([value, undefined] as const, {
    expect: () => value,
  });
}

function Err<E extends Error = Error>(error: E): ResultError<E> {
  return Object.assign([undefined, error] as const, {
    expect: (message?: string) => {
      if (message === undefined) throw error;
      throw new ReThrownError(message, error);
    },
  });
}

export const ResultCreator = {
  Ok,
  Err,
};

export function createPromiseResult<T, E extends Error = Error>() {
  const [p, ok, err] = createPromise<T, E>();
  return [wrap(p), ok, err] as const;
}

export default createPromise;

/**
 * wrap a promise value to PromiseResult type
 */
async function wrapValue<T>(value: T | Promise<T>): PromiseResult<T> {
  if (typeof value === 'function') {
    throw new Error(
      'Unsupported function: Use wrap instead of wrapValue to wrap function'
    );
  }
  try {
    const v = await value;
    return Ok(v);
  } catch (e) {
    return Err(
      e instanceof Error ? e : new Error(String(e ?? 'Unknown error'))
    );
  }
}

/**
 * Wrap a function return PromiseResult type.
 * don't use if directly, use {@link wrap} can get completely intellisense
 * @inner
 */
const wrapFunction =
  <T, P extends unknown[]>(func: (...args: P) => Promise<T> | T) =>
  (...args: Parameters<typeof func>) =>
    wrapValue<T>(
      (() => {
        try {
          return func(...args);
        } catch (e) {
          return Promise.reject(e);
        }
      })()
    );

// type Wrap = typeof wrapFunction | typeof wrapResult;
export function wrap<T>(response: Promise<T>): PromiseResult<T>;
export function wrap<T, P extends unknown[]>(
  func: AwaitableFunction<T, P>
): (...args: P) => PromiseResult<T>;

/**
 * wrap a promise or promise function, if promise function, wrap it's result
 * @param thenable
 * @returns
 */
export function wrap<T, P extends unknown[]>(
  thenable: AwaitableFunction<T, P> | Promise<T> | T
) {
  function isAwaitableFunction(
    thenable: unknown
  ): thenable is AwaitableFunction<T, P> {
    return typeof thenable === 'function';
  }
  return isAwaitableFunction(thenable)
    ? wrapFunction(thenable)
    : wrapValue(thenable);
}

/**
 * It return the value from the Result, and throw error if the Result is error
 */
export const unwrap = <T, E = Error>(result: Result<T, E>): T => {
  function assertResultOK(result: Result<T, E>): asserts result is ResultOK<T> {
    const [, error] = result;
    if (error !== undefined) throw error;
  }
  assertResultOK(result);
  return result[0];
};
