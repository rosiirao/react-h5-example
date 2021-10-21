import {findPath, Predicate} from './findPath';

describe('object shared function test', () => {
  it('findPath(object, predicate) works', () => {
    const t = {
      a: 'first',
      a1: {b: '333', c: 'any string here', d: 'to find context'},
      b: {c: 2, d: {e: 'to find indicated'}},
      c: {c: 2, d: 'repeated find here', findOnKey: 'any string here'},
      d: {d1: '', secondFindOnKey: 'any'},
    };

    function findStr(str: string) {
      return function (this: {value: string} | void, val: unknown) {
        if (typeof val !== 'string') return false;
        const findOnThis = this === undefined ? true : this.value.indexOf(val);
        return val.indexOf(str) > -1 && findOnThis;
      };
    }

    function findOnKey(str: string) {
      return function (this: {value: string} | void, _: unknown, key: string) {
        if (typeof key !== 'string') return false;
        const findOnThis = this === undefined ? true : this.value.indexOf(key);
        return key.indexOf(str) > -1 && findOnThis;
      };
    }

    expect(findPath(t, findStr('first'))).toEqual(['a']);
    expect(findPath(t, findStr('find indicated'))).toEqual(['b', 'd', 'e']);
    expect(findPath(t, findStr('never appear'))).toEqual([]);
    expect(findPath(t, findOnKey('Key') as Predicate<string>)).toEqual([
      'c',
      'findOnKey',
    ]);
    expect(findPath(t, findOnKey('never appear') as Predicate<string>)).toEqual(
      []
    );

    const context = {value: 'context'};
    findStr('find').call(context, t.a1.d);
    expect(findStr('find').call(context, t.a1.d)).toBeTruthy();
    expect(findPath(t, findStr('find'), context)).toEqual(['a1', 'd']);
  });
});
