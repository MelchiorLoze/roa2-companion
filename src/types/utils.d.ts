import { type UnistylesThemes } from 'react-native-unistyles';
import { type ReadonlyDeep } from 'type-fest';

type PrimaryThemeFonts = Theme['font']['primary'];
type SecondaryThemeFonts = Theme['font']['secondary'];

declare global {
  type DeepReadonly<T> = ReadonlyDeep<T>;
  type Theme = UnistylesThemes['default'];
  type FontFamily = PrimaryThemeFonts[keyof PrimaryThemeFonts] | SecondaryThemeFonts[keyof SecondaryThemeFonts];
  type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
  type Either<A, B> =
    | ({ [K in keyof A]: A[K] } & { [K in keyof B]?: never })
    | ({ [K in keyof A]?: never } & { [K in keyof B]: B[K] });
}

export {};
