export default class NoFindTagFunctionError extends Error {
  date: Date;
  constructor(...params: (string | undefined)[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoFindTagFunctionError);
    }
    this.message = this.message || 'Customized MyError Default Message';
    this.name = 'NoFindTagFunctionError';
    this.date = new Date();
  }
}
