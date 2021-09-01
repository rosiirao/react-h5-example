interface A {
  a: string;
}

interface B extends A {
  b: string;
}

export const b: B = {
  a: 's',
  b: 'abc',
};
interface Cache {
  take: <T>(key: string) => T | PromiseLike<T>;
  ttl?: (key: string, ttl: number) => void;
  clear?: () => void;
}

type MessageOp<T> = {
  [P in keyof T]: {
    id: string;
    action: P;
    arg: T[P] extends ((...args: infer V) => unknown) | void ? V : T[P];
  };
}[keyof T];

// type CacheMessageOp<K extends keyof Cache = keyof Cache> = MessageOp<Cache, K>;
export type C = NonNullable<MessageOp<Cache>>['arg'];

// let A, B;
// {
  let friendA: {
    getX: <T>(obj: CA<T>)=>T
    setX: <T>(obj: CA<T>, value:T)=>void
  };

  class CA<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    #x: T;

    // eslint-disable-next-line prettier/prettier
    static {
        friendA = {
          getX<T>(obj: CA<T>) { return obj.#x },
          setX<T>(obj: CA<T>, value: T) { obj.#x = value }
        };
    }
  }

  class CB<T> {
    constructor(private a: CA<T>, x: T) {
      friendA.setX(a, x); // ok
    }
    get x():T{
      return friendA.getX<T>(this.a);
    }
  }
// }

export {CA, CB}

