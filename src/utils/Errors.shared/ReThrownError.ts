export class ReThrownError extends Error {
  original_error?: Error;
  stack_before_rethrow?: string;
  constructor(message: string, original_error: Error) {
    if (!original_error)
      throw new Error('ReThrownError requires a message and error');
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.original_error = original_error;
    this.stack_before_rethrow = this.stack;

    concatStack(this, original_error);

    function concatStack(error: Error, original_error: Error) {
      const message_lines = (error.message.match(/\n/g) || []).length + 1;
      error.stack =
        original_error.stack === undefined
          ? error.stack
          : error.stack === undefined
          ? original_error.stack
          : error.stack
              .split('\n')
              .slice(0, message_lines + 1)
              .join('\n') +
            '\n' +
            original_error.stack;
    }
  }
}

export default ReThrownError;
