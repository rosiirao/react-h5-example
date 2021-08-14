export class HttpError extends Error {
  status;
  xhr;
  constructor(
    status: number,
    xhr: XMLHttpRequest | {response: Response; request?: Request},
    ...errorParam: Parameters<ErrorConstructor>
  ) {
    super(...errorParam);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
    this.status = status;
    this.xhr = xhr;
  }
}

export type Result<T, E = Error> = readonly [value?: T, error?: E];

export const wrap = <T, E = Error>(
  response: Promise<T>
): Promise<Result<T, E>> => {
  return response.then(r => [r] as const).catch(e => [undefined, e]);
};

export const wrapCompose =
  <T, F extends (...args: never[]) => Promise<T>>(func: F) =>
  (...args: Parameters<typeof func>) =>
    wrap<T>(func(...args));

export const unwrap = <T, E = Error>([response, error]: Result<T, E>): T => {
  if (error !== undefined) {
    throw error;
  }
  return response!;
};
