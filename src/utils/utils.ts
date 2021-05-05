export type ThenArg<T> = T extends PromiseLike<infer U>
  ? U
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => PromiseLike<infer V>
  ? V
  : T;

/**
 *
 * @param fn
 * @param timeout
 * @param options
 *    onceInQueue: 如果一直调用， 则一直不执行， 直到在指定时间内没有重复调用
 * @returns 最后一次成功执行的函数返回包装了值的 Promise ， 否则返回 Promise<void>
 */
export const debounce = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (...arg: any[]) => any,
  R = ThenArg<ReturnType<F>>
>(
  fn: F,
  timeout: number,
  {onceInQueue} = {onceInQueue: false}
) => {
  let _timer: number | undefined;
  let _arg: Parameters<typeof fn> | undefined;
  let _r: (r?: R) => void;
  let _p: Promise<R | void>;
  return (...arg: Parameters<typeof fn>): Promise<R | void> => {
    _arg = arg;

    // resolve last call
    if (_timer !== undefined) _r();

    // current call promise
    _p = new Promise(resolve => (_r = resolve));

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
      _r(r);
    }, timeout);
    return _p;
  };
};
