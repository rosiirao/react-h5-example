export type Element<T> = T extends (infer U)[] ? U : never;

export type ThenArg<T> = T extends PromiseLike<infer U>
  ? U
  : T extends (...args: never[]) => PromiseLike<infer V>
  ? V
  : T;

export type PropType<T, P extends keyof T> = T[P];
