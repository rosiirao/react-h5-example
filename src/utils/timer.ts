const timer_cancelled = Symbol('cancelled');
/**
 * createTimer() return a timer function
 * @param ms should not less than 10ms
 */
function createTimer(ms = 500) {
  const base = ms;
  let p: NodeJS.Timeout;
  let ok: (value?: typeof timer_cancelled) => void;
  /**
   * timer() returns a promise will resolved ,
   * when it is called once again, the promise returned previous in time quota will be resolved with throttle_cancelled value
   */
  return function timer(ms = base) {
    ms = Math.max(ms, 10);
    if (p !== undefined) {
      clearTimeout(p);
      ok(timer_cancelled);
    }
    const r = new Promise<typeof timer_cancelled | void>(r => (ok = r));
    p = setTimeout(() => void ok(), ms);
    return r;
  };
}

export default {
  createTimer,
  timer_cancelled,
} as const;
