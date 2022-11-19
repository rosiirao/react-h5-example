import timer from './timer';

/**
 *
 * @param fn
 * @param timeout
 * @param options
 *    onceInQueue: 如果一直调用， 则一直不执行， 直到在指定时间内没有重复调用
 * @returns 最后一次成功执行的函数返回 Promise<T> ， 否则返回 Promise<void>
 */
export const debounce = <T, P extends unknown[]>(
  fn: (...args: P) => T,
  timeout: number,
  {onceInQueue} = {onceInQueue: false}
) => {
  if (timeout < 0)
    throw new Error(`timeout parameter must be greater than 0, got ${timer}`);
  type R = Promise<typeof timer.timer_cancelled | void> | void;
  // Two timers, volatile.timer is cancelled if new comes
  const [volatile, stay] = [0, 0].map(() => ({
    timer: undefined as R,
    set: timer.createTimer(timeout),
  }));
  return async function (...args: P): Promise<T | void> {
    if (onceInQueue) {
      const t = await volatile.set();
      if (t === timer.timer_cancelled) return;
      return fn(...args);
    }
    if (stay.timer === undefined) stay.timer = stay.set();
    volatile.timer = volatile.set();
    const v = await Promise.race([volatile.timer, stay.timer]);
    if (v === timer.timer_cancelled) return;
    stay.timer = undefined;
    return fn(...args);
  };
};
