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
