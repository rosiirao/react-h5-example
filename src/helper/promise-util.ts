import {ThenArg} from './types.util';

const createPromise = <T, E extends Error = Error>() => {
  let ok: (value: T) => void, err: (err: E) => void;
  const p = new Promise<T>((r, j) => {
    ok = r;
    err = j;
  });
  return [p, ok!, err!] as const;
};

export default createPromise;

export type Result<T, E = Error> = readonly [value?: T, error?: E];

const wrapResult = <T, E = Error>(
  response: Promise<T>
): Promise<Result<T, E>> => {
  return response.then(r => [r] as const).catch(e => [undefined, e]);
};

type PromiseFunction<F> = (...args: never[]) => Promise<ThenArg<F>>;

const wrapFunction =
  <F extends PromiseFunction<F>, E>(func: F) =>
  (...args: Parameters<typeof func>) =>
    wrapResult<ThenArg<F>, E>(func(...args));

// type Wrap = typeof wrapFunction | typeof wrapResult;
export function wrap<T, E = Error>(response: Promise<T>): Promise<Result<T, E>>;
export function wrap<F extends PromiseFunction<F>, E = Error>(
  func: F
): (
  ...args: Parameters<typeof func>
) => Promise<Result<ThenArg<typeof func>, E>>;

/**
 * wrap a promise or promise function, if promise function, wrap it's result
 * @param thenable
 * @returns
 */
export function wrap<T, F extends PromiseFunction<F>, E = Error>(
  thenable: Promise<T> | F
) {
  return thenable instanceof Function
    ? wrapFunction<F, E>(thenable)
    : wrapResult<T, E>(thenable);
}

export const unwrap = <T, E = Error>([response, error]: Result<T, E>): T => {
  if (error !== undefined) {
    throw error;
  }
  return response!;
};
