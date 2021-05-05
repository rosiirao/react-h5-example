import {debounce} from './utils';

describe('utils test', () => {
  beforeAll(() => {
    // jest.useFakeTimers();
  });
  test.each([
    [2, 9],
    [2, 20],
  ])('debounce %i output %i', async (times, count) => {
    const fn: (i: number) => number = jest
      .fn()
      .mockImplementation((a: number) => a);
    const d = debounce(fn, 100);
    let start = 1;
    for (let t = 0; t < times; t++) {
      let r: (value: number) => void;
      const p = new Promise<number>(resolve => (r = resolve)); // reset p and r
      for (let c = 0; c < count; c++) {
        d(c + start).then(dr => (typeof dr === 'number' ? r(dr) : undefined));
      }
      // jest.advanceTimersByTime(50);
      expect(fn).toBeCalledTimes(t);
      // jest.advanceTimersByTime(100);
      const e = await p;
      start = e + 1;
    }

    expect(fn).toHaveBeenCalledTimes(times);
    Array(times)
      .fill(1)
      .forEach((_, t) => {
        expect(fn).toHaveBeenNthCalledWith(t + 1, (t + 1) * count);
      });
  });
  test.each([
    [2, 9],
    [2, 20],
  ])('debounce %i output %i with onceInQueue', async (times, count) => {
    const fn: (i: number) => number = jest
      .fn()
      .mockImplementation((a: number) => a);
    const d = debounce(fn, 100, {onceInQueue: true});
    let start = 1;
    for (let t = 0; t < times; t++) {
      let r: (value: number) => void;
      const p = new Promise<number>(resolve => (r = resolve)); // reset p and r
      for (let c = 0; c < count; c++) {
        d(c + start).then(dr => (typeof dr === 'number' ? r(dr) : undefined));
        // jest.advanceTimersByTime(50);
      }
      expect(fn).toBeCalledTimes(t);
      // jest.advanceTimersByTime(100);
      const e = await p;
      start = e + 1;
    }

    expect(fn).toHaveBeenCalledTimes(times);
    Array(times)
      .fill(1)
      .forEach((_, t) => {
        expect(fn).toHaveBeenNthCalledWith(t + 1, (t + 1) * count);
      });
  });
});
