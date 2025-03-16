import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStorage from 'expo-secure-store';
import { Platform } from 'react-native';

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

const TEST_KEY = 'test-key';
const MOCK_OBJECT = {
  id: 123,
  name: 'John Doe',
};
const SERIALIZED_MOCK_OBJECT = JSON.stringify(MOCK_OBJECT);

const renderUseStorageState = async (isMobileEnv = true, converter?: (raw: any) => any) => {
  const { result } = renderHook(() => useStorageState(TEST_KEY, converter));

  if (isMobileEnv) expect(result.current[0][1]).toBe(true);

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
      const [[stateValue]] = result.current;

      expect(stateValue).toBe(null);
    });

    it('should load value from SecureStore on initialization', async () => {
      getItemAsyncMock.mockResolvedValue(SERIALIZED_MOCK_OBJECT);

      const { result } = await renderUseStorageState();

      expect(getItemAsyncMock).toHaveBeenCalledWith(TEST_KEY);

      const [[stateValue]] = result.current;
      expect(stateValue).toEqual(MOCK_OBJECT);
    });

    it('should convert the loaded value using the converter function', async () => {
      getItemAsyncMock.mockResolvedValue(SERIALIZED_MOCK_OBJECT);

      const { result } = await renderUseStorageState(true, (raw) => ({ ...raw, age: 30 }));

      const [[stateValue]] = result.current;
      expect(stateValue).toEqual({ ...MOCK_OBJECT, age: 30 });
    });

    it('should save value to SecureStore when setValue is called', async () => {
      const { result } = await renderUseStorageState();
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(MOCK_OBJECT);
      });

      expect(setItemAsyncMock).toHaveBeenCalledWith(TEST_KEY, expect.any(String));

      // Verify the serialized data is correct
      const savedData = setItemAsyncMock.mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(parsedData).toEqual(MOCK_OBJECT);
    });

    it('should remove value from SecureStore when setValue is called with null', async () => {
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

    it('should initialize with loading state and null value', async () => {
      const { result } = await renderUseStorageState(false);
      const [[stateValue]] = result.current;

      expect(stateValue).toBe(null);
    });

    it('should load value from localStorage on initialization', async () => {
      localStorageMock.setItem(TEST_KEY, SERIALIZED_MOCK_OBJECT);

      const { result } = await renderUseStorageState(false);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);

      const [[stateValue]] = result.current;
      expect(stateValue).toEqual(MOCK_OBJECT);
    });

    it('should convert the loaded value using the converter function', async () => {
      localStorageMock.setItem(TEST_KEY, SERIALIZED_MOCK_OBJECT);

      const { result } = await renderUseStorageState(false, (raw) => ({ ...raw, age: 30 }));

      const [[stateValue]] = result.current;
      expect(stateValue).toEqual({ ...MOCK_OBJECT, age: 30 });
    });

    it('should save value to localStorage when setValue is called', async () => {
      const { result } = await renderUseStorageState(false);
      const [_, setValue] = result.current;

      await act(async () => {
        setValue(MOCK_OBJECT);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, expect.any(String));

      // Verify the serialized data is correct
      const savedData = localStorageMock.setItem.mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(parsedData).toEqual(MOCK_OBJECT);
    });

    it('should remove value from localStorage when setValue is called with null', async () => {
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
