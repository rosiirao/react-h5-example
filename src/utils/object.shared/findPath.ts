import {Element} from '../types.util';

export type Predicate<T, This = undefined> = This extends undefined
  ? (value: T, key?: string | number, object?: Object) => unknown
  : (this: This, value: T, key?: string, object?: Object) => unknown;

type PathElement = string | number | Symbol;
type Path = Array<PathElement>;
type Value = unknown;

export function* findPathGen<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Generator<Path, void, void> {
  const flattedObject = new Map<Object, 'pending' | 'done'>();
  flattedObject.set(object, 'pending');
  /**
   * The objects has been traversed reference to some objects on the current property path,
   * so once find the predicated, the reference objects path must be yield
   */
  const pendingRefObjectStack = new Map<Value, Array<PathStack>>();
  /**
   * The map of the key is matched value,
   * and the element is the tuple of path and the index number of the return paths
   */
  const foundPath = new Map<Value, [path: Path, foundNumber: number]>();
  let indexOfFound = 0;
  /**
   * The item's path stack
   */
  type PathStack = Array<[key: PathElement, value: Value]>;
  /**
   * The current path stack;
   */
  const index: PathStack = [];
  function* appendFoundAndYield(found: PathStack): Generator<Path, void, void> {
    const path = found.map(([key]) => key);
    const middleWay: Array<PathElement> = [];
    for (const [key, value] of found) {
      middleWay.push(key);
      const referenceProperty: [Path, number] = [[...middleWay], indexOfFound];
      if (pendingRefObjectStack.has(value)) {
        for (const reference of pendingRefObjectStack.get(value) ?? []) {
          yield [
            ...reference.map(([key]) => key),
            wrapReferenceProperty(referenceProperty),
          ];
        }
      }
      // Only update, make the foundPath has the shortest reference path
      if (!foundPath.has(value)) foundPath.set(value, referenceProperty);
    }
    indexOfFound++;
    yield path;
  }

  /**
   * Wrap the property name of value which is another property,
   * the wrapped property is an Symbol contains info to the reference property path
   */
  function wrapReferenceProperty(
    reference: Element<typeof foundPath>
  ): PathElement {
    return Symbol(`#${reference[1]}@${reference[0].map(String).join('/')}`);
  }

  function* findPathGenInner<T, This = void>(
    object: Object,
    predicate: Predicate<T, This>,
    thisArg?: This
  ): Generator<Path, void, void> {
    // A pseudo key for pre-first path
    const pseudo = Symbol('pseudo');
    // it will be popped at the end of function or read first item;
    index.push([pseudo, undefined]);
    for (const [keyIn, value] of Object.entries(object)) {
      const key = Array.isArray(object) ? Number(keyIn) : keyIn;
      index.pop();
      index.push([key, value]);
      const valueOfObject = typeof value === 'object' && value !== null;
      if (valueOfObject && flattedObject.has(value)) {
        if (foundPath.has(value)) {
          index.push([wrapReferenceProperty(foundPath.get(value)!), value]); // append the path with the reference property
          yield* appendFoundAndYield(index);
          index.pop();
        }
        if (flattedObject.get(value) === 'pending') {
          pendingRefObjectStack.set(value, [
            ...(pendingRefObjectStack.get(value) ?? []),
            index,
          ]);
        }
        continue;
      }
      if (valueOfObject) flattedObject.set(value, 'pending');

      const match =
        thisArg === undefined
          ? (predicate as Predicate<T, undefined>)(value, key, object)
          : predicate.call(thisArg, value);
      if (Boolean(match) === true) {
        yield* appendFoundAndYield(index);
      }

      if (Array.isArray(value) || value instanceof Object) {
        yield* findPathGenInner(value, predicate, thisArg);
      }

      if (valueOfObject) {
        flattedObject.set(value, 'done');
        pendingRefObjectStack.delete(value);
      }
    }
    index.pop(); // pop the path;
  }
  yield* findPathGenInner(object, predicate, thisArg);
}

export function findPath<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Array<string | number | Symbol> {
  const pathGen = findPathGen(object, predicate, thisArg);
  const path = pathGen.next();
  if (!path.done) pathGen.return();
  return path.value ?? [];
}

export function findAllPath<T, This = void>(
  object: Object,
  predicate: Predicate<T, This>,
  thisArg?: This
): Array<Array<string | number | Symbol>> {
  return [...findPathGen(object, predicate, thisArg)];
}
