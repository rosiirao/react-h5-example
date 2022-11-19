import createPromise from './promise-util';
const timer_cancelled = Symbol('cancelled');

/**
 * createTimer() return a timer function
 * @param ms should not less than 10ms
 */
function createTimer(ms = 500) {
  const base = ms;
  let t: NodeJS.Timeout;
  let p: Promise<typeof timer_cancelled | void>;
  let ok: (value?: typeof timer_cancelled) => void;
  /**
   * @return a promise will resolved ,
   * when it is called once again, the promise previously returned will be resolved with *timer_cancelled*
   */
  return function timer(ms = base) {
    ms = Math.max(ms, 10);
    if (t !== undefined) {
      clearTimeout(t);
      ok(timer_cancelled);
    }
    [p, ok] = createPromise<typeof timer_cancelled | void>();
    t = setTimeout(() => void ok(), ms);
    return p;
  };
}

export default {
  createTimer,
  timer_cancelled,
} as const;
