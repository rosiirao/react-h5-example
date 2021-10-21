export type Predicate<T, This = undefined> = This extends undefined
  ? (value: T, key?: string, object?: Object) => unknown
  : (this: This, value: T, key?: string, object?: Object) => unknown;

export function findPath<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Array<string> {
  const path = Object.entries(object).reduce<Array<string>>(
    (acc, [key, value]) => {
      if (acc.length > 0) return acc; // only find one
      const match =
        thisArg === undefined
          ? (predicate as Predicate<T, undefined>)(value, key, object)
          : predicate.call(thisArg, value);
      if (Boolean(match) === true) {
        acc.push(key);
        return acc;
      }

      if (value instanceof Object) {
        const sub = findPath(value, predicate, thisArg);
        if (sub.length > 0) {
          return [key, ...sub];
        }
      }
      return acc;
    },
    []
  );
  return path;
}
