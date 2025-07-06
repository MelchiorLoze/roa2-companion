import { type ReadonlyDeep } from 'type-fest';

declare global {
  type DeepReadonly<T> = ReadonlyDeep<T>;
}

export {};
