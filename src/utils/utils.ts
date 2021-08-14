import createPromise from '../helper/promise-util';

/**
 *
 * @param fn
 * @param timeout
 * @param options
 *    onceInQueue: 如果一直调用， 则一直不执行， 直到在指定时间内没有重复调用
 * @returns 最后一次成功执行的函数返回包装了值的 Promise ， 否则返回 Promise<void>
 */
export const debounce = <T, F extends (...arg: never[]) => T>(
  fn: F,
  timeout: number,
  {onceInQueue} = {onceInQueue: false}
) => {
  let _timer: number | undefined;
  let _arg: Parameters<typeof fn> | undefined;
  let _ok: (r?: T) => void;
  let _p: Promise<T | void>;
  return (...arg: Parameters<typeof fn>): PromiseLike<T | void> => {
    _arg = arg;

    // resolve last call
    if (_timer !== undefined) _ok();

    // current call promise
    [_p, _ok] = createPromise<T | void>();

    if (_timer !== undefined) {
      if (!onceInQueue) {
        return _p;
      }
      clearTimeout(_timer);
    }

    _timer = window.setTimeout(() => {
      const r = fn(...(_arg ?? []));
      _timer = undefined;
      _arg = undefined;
      _ok(r);
    }, timeout);
    return _p;
  };
};
