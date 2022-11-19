import createPromise from './promise-util';
import {debounce} from './debounce';

describe('utils test', () => {
  beforeAll(() => {
    // jest.useFakeTimers();
  });
  test.each([
    [2, 9, 100],
    [3, 10, 5],
  ])(
    'debounce %i times acc %i count and every time plus %i',
    async (times, count, gap) => {
      const fn = jest
        .fn<number, [number]>()
        .mockImplementation((a: number) => a);
      const d = debounce(fn, 100);
      let acc = gap; /** last turn value plus 10 */
      for (let t = 0; t < times; t++) {
        const [p, ok] = createPromise<number>();
        for (let c = 0; c < count; c++) {
          d(c + acc).then(dr => (typeof dr === 'number' ? ok(dr) : undefined));
        }
        // jest.advanceTimersByTime(50);
        expect(fn).toBeCalledTimes(t);
        // jest.advanceTimersByTime(100);
        const e = await p;
        expect(e).toBe(acc + count - 1);
        acc = e + gap;
      }

      expect(fn).toHaveBeenCalledTimes(times);
      new Array(times).fill(times).forEach((_, t) => {
        expect(fn).toHaveBeenNthCalledWith(t + 1, (t + 1) * (count + gap - 1));
      });
    }
  );
  test.each([
    [2, 9],
    [2, 20],
  ])('debounce %i times output %i with onceInQueue', async (times, count) => {
    const fn: (i: number) => number = jest
      .fn()
      .mockImplementation((a: number) => a);
    const d = debounce(fn, 100, {onceInQueue: true});
    let start = 1;
    for (let t = 0; t < times; t++) {
      const [p, ok] = createPromise<number>();
      for (let c = 0; c < count; c++) {
        d(c + start).then(dr => (typeof dr === 'number' ? ok(dr) : undefined));
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
