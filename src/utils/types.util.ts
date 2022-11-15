export type Element<T> = T extends (infer U)[] | Map<unknown, infer U>
  ? U
  : never;

export type ThenArg<T> = T extends PromiseLike<infer U>
  ? Awaited<U>
  : T extends (...args: unknown[]) => infer V
  ? Awaited<V>
  : T;

export type PropType<T, P extends keyof T> = T[P];
