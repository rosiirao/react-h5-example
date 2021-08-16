import {wrap} from './promise-util';
import createPromise from './promise-util';

describe('promise util', () => {
  test.each([
    [undefined, undefined],
    ['string', undefined],
    [{}, new Error('an error')],
    ['b', undefined],
  ])('wrap promise result', async (input_result, input_error) => {
    const [p, ok, err] = createPromise<typeof input_result>();
    const promiseResult = () => wrap(p);
    if (input_error !== undefined) {
      err(input_error);
    }
    ok(input_result);
    const [result, error] = await promiseResult();
    if (error !== undefined) {
      if (input_error instanceof Error) expect(error).toBe(input_error);
      else expect(error.message).toBe(String(input_error));
      return;
    }
    expect(result).toBe(input_result);
  });
});
