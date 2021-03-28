/**
 * Some explanation to Class based on Function syntax.
 */

const OneClass = (function (this: {name: string}) {
  if (new.target === undefined) {
    throw new Error('You must use new to call OneClass');
  }
  this.name = 'one';
} as unknown) as {new (): typeof OneClass};

declare class OtherClass /* extends Error  */ {
  // constructor(message: string);
  constructor();
}

function OtherClass(this: {name: string}) {
  this.name = 'other';
}

// the second argument correspond to the second argument of Object.defineProperties().
// OtherClass.prototype = Object.create(Error.prototype, {
//   name: {value: 'Custom Error', enumerable: false},
// });

function testReflect() {
  const args: [] = [];

  const obj = new OneClass();

  console.log('has create one class');
  // Calling this, new.target = OtherClass when OneClass running:
  const obj1 = Reflect.construct(OneClass, args, OtherClass);

  console.log('has create one class at 2nd time');

  // ...has the same result as this:
  const obj2 = Object.create(OtherClass.prototype);
  OneClass.apply(obj2, args);

  return [obj, obj1, obj2];
}

export default testReflect;
