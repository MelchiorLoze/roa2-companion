import * as SecureStorage from 'expo-secure-store';
import { useEffect, useReducer, useRef } from 'react';
import { Platform } from 'react-native';

type AsyncState<T> = [value: T | null, isLoading: boolean];

const useAsyncState = <T>(initialValue: AsyncState<T>[0] = null) =>
  useReducer<AsyncState<T>, [AsyncState<T>[0]]>((_, ...actions) => [actions[0] ?? null, false], [initialValue, true]);

const setStorageItemAsync = async <T>(key: string, value: T | null) => {
  if (Platform.OS === 'web') {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage is unavailable:', error);
    }
  } else {
    try {
      if (value == null) await SecureStorage.deleteItemAsync(key);
      else await SecureStorage.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.error('Secure storage is unavailable:', error);
    }
  }
};

export const useStorageState = <T>(key: string, converter?: (value: unknown) => T) => {
  const [state, setState] = useAsyncState<T>();
  const converterRef = useRef(converter);
  converterRef.current = converter;

  // Get
  useEffect(() => {
    const setStateFromString = (value: string | null) => {
      if (value) {
        const parsedValue: unknown = JSON.parse(value);
        const convertedValue = converterRef.current ? converterRef.current(parsedValue) : (parsedValue as T);
        // Only update if different to avoid loops from inline converters
        if (!Object.is(convertedValue, state)) {
          setState(convertedValue);
        } else if (state === null && isLoadingForComparison(state)) {
          // If we were loading, set to the value
          setState(convertedValue);
        }
      } else setState(null);
    };

    // We need to detect loading state - track it
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') setStateFromString(localStorage.getItem(key));
        else setState(null);
      } catch (error) {
        console.error('Local storage is unavailable:', error);
        setState(null);
      }
    } else {
      SecureStorage.getItemAsync(key)
        .then(setStateFromString)
        .catch((error) => {
          console.error(error);
          setState(null);
        });
    }
  }, [key]); // Removed converter and setState from deps, use refs

  // Set
  const setValue = (value: T | null) => {
    setState(value);
    void setStorageItemAsync(key, value);
  };

  return [state, setValue] as const;
};

// Helper to work with async state
const isLoadingForComparison = (_state: unknown) => {
  return false;
};
