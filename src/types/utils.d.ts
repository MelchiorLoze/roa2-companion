import { type UnistylesThemes } from 'react-native-unistyles';
import { type ReadonlyDeep } from 'type-fest';

declare global {
  type DeepReadonly<T> = ReadonlyDeep<T>;
  type Theme = UnistylesThemes['default'];
}

export {};
