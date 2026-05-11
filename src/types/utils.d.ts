import { type UnistylesThemes } from 'react-native-unistyles';
import { type ReadonlyDeep } from 'type-fest';

declare global {
  type DeepReadonly<T> = ReadonlyDeep<T>;
  type Theme = UnistylesThemes['default'];
  type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
  type Either<A, B> =
    | ({ [K in keyof A]: A[K] } & { [K in keyof B]?: never })
    | ({ [K in keyof A]?: never } & { [K in keyof B]: B[K] });
}

export {};
