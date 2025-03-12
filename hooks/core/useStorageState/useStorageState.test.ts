import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStorage from 'expo-secure-store';
import { DateTime } from 'luxon';
import { Platform } from 'react-native';

import { Session } from '@/types/session';

import { useStorageState } from './useStorageState';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios', // Default to iOS, we'll change this in tests
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const getItemAsyncMock = jest.mocked(SecureStorage.getItemAsync);
const setItemAsyncMock = jest.mocked(SecureStorage.setItemAsync);
const deleteItemAsyncMock = jest.mocked(SecureStorage.deleteItemAsync);

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

const TEST_KEY = 'test-session-key';
const MOCK_SESSION: Session = {
  entityToken: 'test-token-123',
  expirationDate: DateTime.now().plus({ days: 1 }),
};
const MOCK_SESSION_STRING = JSON.stringify(MOCK_SESSION);

const renderUseStorageState = async (isLoading = true) => {
  const { result } = renderHook(() => useStorageState(TEST_KEY));

  if (isLoading) expect(result.current[0][1]).toBe(true);

  await waitFor(() => expect(result.current[0][1]).toBe(false));
  return { result };
};

describe('useStorageState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    getItemAsyncMock.mockResolvedValue(null);
  });

  describe('Mobile environment', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('should initialize with loading state and null value', async () => {
      const { result } = await renderUseStorageState();
      const [[session]] = result.current;

      expect(session).toBe(null);
    });

    it('should load session from SecureStore on initialization', async () => {
      getItemAsyncMock.mockResolvedValue(MOCK_SESSION_STRING);

      const { result } = await renderUseStorageState();

      expect(getItemAsyncMock).toHaveBeenCalledWith(TEST_KEY);

      const [[session]] = result.current;
      expect(session).toEqual(MOCK_SESSION);
    });

    it('should save session to SecureStore when setValue is called', async () => {
      const { result } = await renderUseStorageState();
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(MOCK_SESSION);
      });

      expect(setItemAsyncMock).toHaveBeenCalledWith(TEST_KEY, expect.any(String));

      // Verify the serialized data is correct
      const savedData = setItemAsyncMock.mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(parsedData.entityToken).toBe(MOCK_SESSION.entityToken);
      expect(DateTime.fromISO(parsedData.expirationDate).toMillis()).toBeCloseTo(
        MOCK_SESSION.expirationDate.toMillis(),
        -2, // Allowing 100ms difference due to serialization/parsing
      );
    });

    it('should remove session from SecureStore when setValue is called with null', async () => {
      const { result } = await renderUseStorageState();
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(null);
      });

      expect(deleteItemAsyncMock).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should handle JSON parse errors gracefully', async () => {
      getItemAsyncMock.mockResolvedValue('invalid-json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      renderHook(() => useStorageState(TEST_KEY));

      await act(async () => {
        await Promise.resolve();
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Web environment', () => {
    beforeEach(() => {
      Platform.OS = 'web';

      Object.defineProperty(global, 'localStorage', { value: localStorageMock, configurable: true });
    });

    it('should load session from localStorage on initialization', async () => {
      localStorageMock.setItem(TEST_KEY, MOCK_SESSION_STRING);

      const { result } = await renderUseStorageState(false);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);

      const [[session]] = result.current;
      expect(session).toEqual(MOCK_SESSION);
    });

    it('should save session to localStorage when setValue is called', async () => {
      const { result } = await renderUseStorageState(false);
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(MOCK_SESSION);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, expect.any(String));

      // Verify the serialized data is correct
      const savedData = localStorageMock.setItem.mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(parsedData.entityToken).toBe(MOCK_SESSION.entityToken);
      expect(DateTime.fromISO(parsedData.expirationDate).toMillis()).toBeCloseTo(
        MOCK_SESSION.expirationDate.toMillis(),
        -2, // Allowing 100ms difference
      );
    });

    it('should remove session from localStorage when setValue is called with null', async () => {
      const { result } = await renderUseStorageState(false);
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(null);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      renderHook(() => useStorageState(TEST_KEY));

      expect(consoleSpy).toHaveBeenCalledWith('Local storage is unavailable:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle undefined localStorage gracefully', async () => {
      Object.defineProperty(global, 'localStorage', { value: undefined });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      renderHook(() => useStorageState(TEST_KEY));

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
