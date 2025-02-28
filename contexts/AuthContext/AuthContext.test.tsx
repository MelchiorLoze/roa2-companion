import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';

import { useLoginWithEmail } from '@/hooks/useLoginWithEmail/useLoginWithEmail';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('@/hooks/useLoginWithEmail/useLoginWithEmail');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);

const asyncStorageGetItemSpy = jest.spyOn(AsyncStorage, 'getItem');
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem');

const oneHourInMs = 1 * 60 * 60 * 1000;
const validExpirationDate = new Date(Date.now() + oneHourInMs);
const invalidExpirationDate = new Date(Date.now() - oneHourInMs);

const queryClient = new QueryClient();

const Wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
  </QueryClientProvider>
);

const renderUseAuth = async () => {
  const { result } = renderHook(useAuth, { wrapper: Wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  return result.current;
};

describe('useAuth', () => {
  beforeEach(() => {
    useLoginWithEmailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      loginWithEmail: jest.fn(),
    });
    asyncStorageGetItemSpy.mockClear();
    asyncStorageSetItemSpy.mockClear();
  });

  it('should throw an error when not used inside an AuthProvider', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => renderHook(useAuth)).toThrow('useAuth must be used within an AuthProvider');
    console.error = originalError;
  });

  it('should not be logged in when the storage an login sessions are empty', async () => {
    const result = await renderUseAuth();

    expect(result.isLoggedIn).toBe(false);
    expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(0);
  });

  describe('from storage', () => {
    it('should be logged in when the storage contains a valid session', async () => {
      const session: Session = {
        entityToken: 'token',
        expirationDate: validExpirationDate,
      };
      await AsyncStorage.setItem('session', JSON.stringify(session));
      asyncStorageSetItemSpy.mockClear();

      const result = await renderUseAuth();

      expect(result.isLoggedIn).toBe(true);
      expect(result.entityToken).toBe('token');
      expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
      expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(0);
    });

    it('should not be logged in when the storage contains an expired session', async () => {
      const session: Session = {
        entityToken: 'token',
        expirationDate: invalidExpirationDate,
      };
      await AsyncStorage.setItem('session', JSON.stringify(session));
      asyncStorageSetItemSpy.mockClear();

      const result = await renderUseAuth();

      expect(result.isLoggedIn).toBe(false);
      expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
      expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('from login', () => {
    it('should be logged in when received valid token from login', async () => {
      useLoginWithEmailMock.mockReturnValue({
        data: {
          entityToken: 'token',
          expirationDate: validExpirationDate,
        },
        isLoading: false,
        isError: false,
        loginWithEmail: jest.fn(),
      });

      const result = await renderUseAuth();

      expect(result.isLoggedIn).toBe(true);
      expect(result.entityToken).toBe('token');
      expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
      expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(1);
      expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
        'session',
        JSON.stringify({ entityToken: 'token', expirationDate: validExpirationDate }),
      );
    });

    it('should not be logged in when received expired token from login', async () => {
      useLoginWithEmailMock.mockReturnValue({
        data: {
          entityToken: 'token',
          expirationDate: invalidExpirationDate,
        },
        isLoading: false,
        isError: false,
        loginWithEmail: jest.fn(),
      });

      const result = await renderUseAuth();

      expect(result.isLoggedIn).toBe(false);
      expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
      expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('should prioritize login over storage', async () => {
    useLoginWithEmailMock.mockReturnValue({
      data: {
        entityToken: 'loginToken',
        expirationDate: validExpirationDate,
      },
      isLoading: false,
      isError: false,
      loginWithEmail: jest.fn(),
    });
    await AsyncStorage.setItem(
      'session',
      JSON.stringify({ entityToken: 'storageToken', expirationDate: validExpirationDate }),
    );
    asyncStorageSetItemSpy.mockClear();

    const result = await renderUseAuth();

    await waitFor(() => expect(result.isLoggedIn).toBe(true));
    expect(result.entityToken).toBe('loginToken');
    expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'session',
      JSON.stringify({ entityToken: 'loginToken', expirationDate: validExpirationDate }),
    );
  });
});
