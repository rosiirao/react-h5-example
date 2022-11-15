import {findPath, findAllPath, Predicate} from './findPath';

describe('object shared function test', () => {
  const createStrFinder = (str: string) =>
    function (this: {value: string} | void, val: unknown) {
      if (typeof val !== 'string') return false;
      const findOnThis = this === undefined ? true : this.value.indexOf(val);
      return val.indexOf(str) > -1 && findOnThis;
    };

  it('findPath(object, predicate) works', () => {
    const t = {
      a: 'first',
      a1: {b: '333', c: 'any string here', d: 'to find context'},
      b: {c: 2, d: {e: 'to find indicated'}},
      c: {c: 2, d: 'repeated find here', findOnKey: 'any string here'},
      d: {d1: '', secondFindOnKey: 'any'},
      e: {
        e1: ['any string here', {ee1: 'to find in array'}, 'to find in array'],
      },
      f: {f1: {}, f2: 'to find in array'},
    };

    const tArray = ['any string here', {t}];

    function findOnKey(str: string) {
      return function (this: {value: string} | void, _: unknown, key: string) {
        if (typeof key !== 'string') return false;
        const findOnThis = this === undefined ? true : this.value.indexOf(key);
        return key.indexOf(str) > -1 && findOnThis;
      };
    }

    expect(findPath(t, createStrFinder('first'))).toEqual(['a']);
    expect(findPath(t, createStrFinder('find indicated'))).toEqual([
      'b',
      'd',
      'e',
    ]);
    expect(findPath(t, createStrFinder('never appear'))).toEqual([]);
    expect(findPath(t, findOnKey('Key') as Predicate<string>)).toEqual([
      'c',
      'findOnKey',
    ]);
    expect(findPath(t, findOnKey('never appear') as Predicate<string>)).toEqual(
      []
    );

    expect(findPath(t, createStrFinder('in array'))).toEqual([
      'e',
      'e1',
      1,
      'ee1',
    ]);
    expect(findPath(tArray, createStrFinder('in array'))).toEqual([
      1,
      't',
      'e',
      'e1',
      1,
      'ee1',
    ]);
    expect(findAllPath(tArray, createStrFinder('in array'))).toEqual([
      [1, 't', 'e', 'e1', 1, 'ee1'],
      [1, 't', 'e', 'e1', 2],
      [1, 't', 'f', 'f2'],
    ]);

    const context = {value: 'context'};
    createStrFinder('find').call(context, t['a1']['d']);
    expect(createStrFinder('find').call(context, t['a1']['d'])).toBeTruthy();
    expect(findPath(t, createStrFinder('find'), context)).toEqual(['a1', 'd']);
  });

  it('find all path with self recursive works', () => {
    type E = string | number | R;
    interface R {
      [key: string]: E | Array<E>;
    }
    const t = {
      d: {d1: '', secondFindOnKey: 'any'},
      f: {f1: {}, f2: 'to find in array'},
    } as R;
    Object.assign(t, {f1: t['f'], f2: t['d']});
    t['r1'] = {b: t['f']};
    t['r2'] = {b: t['f']};
    t['r1']['a'] = t['r2'];
    t['r2']['a'] = t['r1'];
    // Got a object  { r1: { a : t.r2, b: t.f}, r2: { a: t.r1, b: t.f}}, the t.r1 and t.r2 is reference mutually
    expect(findAllPath(t, createStrFinder('in array'))).toEqual([
      ['f', 'f2'],
      ['f1', expect.any(Object)],
      ['r1', 'b', expect.any(Object)],
      ['r1', 'a', 'b', expect.any(Object)],
      ['r1', 'a', 'a', expect.any(Object)],
      ['r2', expect.any(Object)],
    ]);
    expect(findAllPath(t, createStrFinder('in array'))).toHaveLength(6);
  });
});
