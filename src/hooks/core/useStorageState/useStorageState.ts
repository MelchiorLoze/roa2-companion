import * as SecureStorage from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';
import { Platform } from 'react-native';

type AsyncState<T> = [value: T | null, isLoading: boolean];

const useAsyncState = <T>(initialValue: AsyncState<T>[0] = null) => {
  return useReducer<AsyncState<T>, [AsyncState<T>[0]]>(
    (_, ...actions) => [actions[0] ?? null, false],
    [initialValue, true],
  );
};

const setStorageItemAsync = async <T>(key: string, value: T | null) => {
  if (Platform.OS === 'web') {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage is unavailable:', error);
    }
  } else {
    if (value == null) await SecureStorage.deleteItemAsync(key);
    else await SecureStorage.setItemAsync(key, JSON.stringify(value));
  }
};

export const useStorageState = <T>(key: string, converter?: (value: unknown) => T) => {
  const [state, setState] = useAsyncState<T>();

  const setStateFromString = useCallback(
    (value: string | null) => {
      if (value) {
        const parsedValue: unknown = JSON.parse(value);
        setState(converter ? converter(parsedValue) : (parsedValue as T));
      } else {
        setState(null);
      }
    },
    [setState, converter],
  );

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setStateFromString(localStorage.getItem(key));
        }
      } catch (error) {
        console.error('Local storage is unavailable:', error);
      }
    } else {
      SecureStorage.getItemAsync(key).then(setStateFromString).catch(console.error);
    }
  }, [key, setStateFromString]);

  // Set
  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      void setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue] as const;
};
