import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import { PropsWithChildren } from 'react';

import { useLoginWithEmail } from '@/hooks/data';
import { TestQueryClientProvider } from '@/test-helpers';
import { Session } from '@/types/session';

import { AuthProvider, useAuth } from './AuthContext';

jest.mock('@/hooks/data/useLoginWithEmail/useLoginWithEmail');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);

const asyncStorageGetItemSpy = jest.spyOn(AsyncStorage, 'getItem');
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem');
const asyncStorageRemoveItemSpy = jest.spyOn(AsyncStorage, 'removeItem');

const validExpirationDate = DateTime.now().plus({ day: 1 });
const invalidExpirationDate = DateTime.now().minus({ day: 1 });

const Wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryClientProvider>
    <AuthProvider>{children}</AuthProvider>
  </TestQueryClientProvider>
);

const renderUseAuth = async () => {
  const { result } = renderHook(useAuth, { wrapper: Wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  return { result };
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
    asyncStorageRemoveItemSpy.mockClear();
  });

  it('should throw an error when not used inside an AuthProvider', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => renderHook(useAuth)).toThrow('useAuth must be used within an AuthProvider');
    console.error = originalError;
  });

  it('should not be logged in when the storage an login sessions are empty', async () => {
    const { result } = await renderUseAuth();

    expect(result.current.isLoggedIn).toBe(false);
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

      const { result } = await renderUseAuth();

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.entityToken).toBe('token');
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

      const { result } = await renderUseAuth();

      expect(result.current.isLoggedIn).toBe(false);
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

      const { result } = await renderUseAuth();

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.entityToken).toBe('token');
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

      const { result } = await renderUseAuth();

      expect(result.current.isLoggedIn).toBe(false);
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

    const { result } = await renderUseAuth();

    await waitFor(() => expect(result.current.entityToken).toBe('loginToken'));
    expect(result.current.isLoggedIn).toBe(true);
    expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
      'session',
      JSON.stringify({ entityToken: 'loginToken', expirationDate: validExpirationDate }),
    );
  });

  it('should logout', async () => {
    const session: Session = {
      entityToken: 'token',
      expirationDate: validExpirationDate,
    };
    await AsyncStorage.setItem('session', JSON.stringify(session));
    asyncStorageSetItemSpy.mockClear();

    const { result } = await renderUseAuth();
    expect(result.current.isLoggedIn).toBe(true);
    await act(async () => result.current.logout());

    await waitFor(() => expect(result.current.isLoggedIn).toBe(false));
    expect(asyncStorageGetItemSpy).toHaveBeenCalledTimes(1);
    expect(asyncStorageSetItemSpy).toHaveBeenCalledTimes(0);
    expect(asyncStorageRemoveItemSpy).toHaveBeenCalledTimes(1);
  });
});
