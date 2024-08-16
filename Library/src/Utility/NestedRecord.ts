export type NestedRecord<K extends keyof any, T> = {
  [P in K]: T | NestedRecord<K, T>;
};
