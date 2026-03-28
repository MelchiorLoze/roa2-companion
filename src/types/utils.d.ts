import { type UnistylesThemes } from 'react-native-unistyles';
import { type ReadonlyDeep } from 'type-fest';

declare global {
  type DeepReadonly<T> = ReadonlyDeep<T>;
  type Theme = UnistylesThemes['default'];
  type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
}

export {};
