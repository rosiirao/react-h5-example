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
    const error_pair =
      error !== undefined
        ? input_error instanceof Error
          ? [error, input_error]
          : [error.message, String(input_error)]
        : undefined;
    expect(error_pair?.[0]).toBe(error_pair?.[1]);
    if (error !== undefined) {
      return;
    }
    expect(result).toBe(input_result);
  });

  test.each([
    [undefined, undefined],
    ['string', undefined],
    [{}, new Error('an error')],
    ['b', undefined],
  ])(
    'wrap promise function or normal function',
    async (input_result, input_error) => {
      const [p, ok, err] = createPromise<typeof input_result>();
      const doPromise = (r: typeof input_result, e: typeof input_error) => {
        if (e !== undefined) {
          err(e);
        }
        ok(r);
        return p;
      };
      const wrapPromiseFunction = wrap(doPromise);
      const wrapNormalFunction = wrap(() => {
        if (input_error !== undefined) throw input_error;
        return input_result;
      });

      const result = await wrapPromiseFunction(input_result, input_error);
      const [value, error] = result;

      expect(result.slice(0, 1)).toEqual(
        (await wrapNormalFunction()).slice(0, 1)
      );
      const error_pair =
        error !== undefined
          ? input_error instanceof Error
            ? [error, input_error]
            : [error.message, String(input_error)]
          : undefined;
      expect(() => {
        if (error !== undefined)
          result.expect('re-thrown error with old error ');
        else throw new Error('re-thrown error undefined');
      }).toThrowError('re-thrown error');
      expect(error_pair?.[0]).toBe(error_pair?.[1]);
      if (error !== undefined) {
        return;
      }
      expect(() =>
        input_error === undefined ? result.expect() : undefined
      ).not.toThrowError();
      expect(input_error === undefined ? result.expect() : undefined).toBe(
        value
      );

      expect(value).toBe(input_result);
    }
  );
});

/**
 * decorator to wrap method's return value
 * because typescript can't infer return type modified by decorators
 * so we can't use this now.
 * @Decorator Wrapper
 */
function Wrapper(
  target: unknown, // static class or class instance
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = wrap(originalMethod);
}

describe('decorator promise result wrapper', () => {
  class TestDecorator {
    @Wrapper
    static simple(x: string, e?: Error) {
      const [p, ok, err] = createPromise<string>();
      if (e !== undefined) err(e);
      ok(x);
      return p;
    }
  }
  test.each([
    ['1', undefined],
    ['2', new Error('second has an error')],
  ])(
    'decorator to wrap method return value',
    async (input_result, input_error) => {
      const r = await TestDecorator.simple(input_result, input_error);
      const value = input_error ? undefined : input_result;
      expect(r[0]).toEqual(value);
      expect(r[1]).toEqual(input_error);
    }
  );
});
