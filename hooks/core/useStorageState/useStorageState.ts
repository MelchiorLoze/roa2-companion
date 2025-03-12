import * as SecureStorage from 'expo-secure-store';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useReducer } from 'react';
import { Platform } from 'react-native';

import { Session } from '@/types/session';

type UseStateHook<T> = [[T | null, boolean], (value: T | null) => void];

function useAsyncState<T>(initialValue: [T | null, boolean] = [null, true]): UseStateHook<T> {
  return useReducer(
    (state: [T | null, boolean], action: T | null = null): [T | null, boolean] => [action, false],
    initialValue,
  ) as UseStateHook<T>;
}

async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStorage.deleteItemAsync(key);
    } else {
      await SecureStorage.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<Session> {
  const [state, setState] = useAsyncState<Session>();

  const setStateFromString = useCallback(
    (value: string | null) => {
      if (value) {
        const storedSession = JSON.parse(value);
        setState({
          entityToken: storedSession.entityToken,
          expirationDate: DateTime.fromISO(storedSession.expirationDate),
        });
      } else {
        setState(null);
      }
    },
    [setState],
  );

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setStateFromString(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStorage.getItemAsync(key).then(setStateFromString).catch(console.error);
    }
  }, [key, setStateFromString]);

  // Set
  const setValue = useCallback(
    (value: Session | null) => {
      setState(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key, setState],
  );

  return [state, setValue];
}
