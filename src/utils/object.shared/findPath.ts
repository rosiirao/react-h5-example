export type Predicate<T, This = undefined> = This extends undefined
  ? (value: T, key?: string | number, object?: Object) => unknown
  : (this: This, value: T, key?: string, object?: Object) => unknown;

export function* findPathGen<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Generator<Array<string | number>, void, void> {
  for (const [keyIn, value] of Object.entries(object)) {
    const key = Array.isArray(object) ? Number(keyIn) : keyIn;
    const match =
      thisArg === undefined
        ? (predicate as Predicate<T, undefined>)(value, key, object)
        : predicate.call(thisArg, value);
    if (Boolean(match) === true) {
      yield [key];
      continue;
    }

    if (Array.isArray(value) || value instanceof Object) {
      for (const sub of findPathGen(value, predicate, thisArg)) {
        yield [key, ...sub];
      }
    }
  }
}

export function findPath<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Array<string | number> {
  const pathGen = findPathGen(object, predicate, thisArg);
  const path = pathGen.next();
  if (!path.done) pathGen.return();
  return path.value ?? [];
}

export function findAllPath<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Array<Array<string | number>> {
  return [...findPathGen(object, predicate, thisArg)];
}
