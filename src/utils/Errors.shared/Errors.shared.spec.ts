import {ReThrownError} from './ReThrownError';

describe('Shared Error class test', () => {
  it('ReThrownError class worked', () => {
    const error = new Error();
    const reThrownError = new ReThrownError('', error);
    expect(reThrownError.original_error).toBe(error);
    expect(reThrownError.stack).toContain(error.stack);
    expect(reThrownError.stack).not.toEqual(error.stack);
  });
});
