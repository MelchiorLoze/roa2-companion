import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import { PropsWithChildren, useState } from 'react';

import { useStorageState } from '@/hooks/business';
import { useLoginWithEmail } from '@/hooks/data';
import { TestQueryClientProvider } from '@/test-helpers';
import { Session } from '@/types/session';

import { AuthProvider, useSession } from './AuthContext';

const VALID_DATE = DateTime.now().plus({ day: 1 });
const EXPIRED_DATE = DateTime.now().minus({ day: 1 });

jest.mock('@/hooks/business');
const useStorageStateMock = jest.mocked(useStorageState);

const mockValidSession = () => {
  useStorageStateMock.mockImplementation(() => {
    const [state, setState] = useState<Session | null>({ entityToken: 'validToken', expirationDate: VALID_DATE });
    return [[state, false], setState];
  });
};
const mockExpiredSession = () => {
  useStorageStateMock.mockImplementation(() => {
    const [state, setState] = useState<Session | null>({ entityToken: 'expiredToken', expirationDate: EXPIRED_DATE });
    return [[state, false], setState];
  });
};
const mockEmptySession = () => {
  useStorageStateMock.mockImplementation(() => {
    const [state, setState] = useState<Session | null>(null);
    return [[state, false], setState];
  });
};

jest.mock('@/hooks/data/useLoginWithEmail/useLoginWithEmail');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);

const Wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryClientProvider>
    <AuthProvider>{children}</AuthProvider>
  </TestQueryClientProvider>
);

const renderUseSession = async () => {
  const { result } = renderHook(useSession, { wrapper: Wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  return { result };
};

describe('useSession', () => {
  beforeEach(() => {
    mockEmptySession();
    useLoginWithEmailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      loginWithEmail: jest.fn(),
    });
  });

  it('should throw an error when not used inside an AuthProvider', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => renderHook(useSession)).toThrow('useSession must be used within an AuthProvider');
    console.error = originalError;
  });

  it('should not be logged in when the storage an login sessions are empty', async () => {
    const { result } = await renderUseSession();

    expect(result.current.isLoggedIn).toBe(false);
  });

  describe('from storage', () => {
    it('should be logged in when the storage contains a valid session', async () => {
      mockValidSession();

      const { result } = await renderUseSession();

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.entityToken).toBe('validToken');
    });

    it('should not be logged in when the storage contains an expired session', async () => {
      mockExpiredSession();

      const { result } = await renderUseSession();

      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('from login', () => {
    it('should be logged in when received valid token from login', async () => {
      useLoginWithEmailMock.mockReturnValue({
        data: {
          entityToken: 'token',
          expirationDate: VALID_DATE,
        },
        isLoading: false,
        isError: false,
        loginWithEmail: jest.fn(),
      });

      const { result } = await renderUseSession();

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.entityToken).toBe('token');
    });

    it('should not be logged in when received expired token from login', async () => {
      useLoginWithEmailMock.mockReturnValue({
        data: {
          entityToken: 'token',
          expirationDate: EXPIRED_DATE,
        },
        isLoading: false,
        isError: false,
        loginWithEmail: jest.fn(),
      });

      const { result } = await renderUseSession();

      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  it('should prioritize login over storage', async () => {
    mockValidSession();
    useLoginWithEmailMock.mockReturnValue({
      data: {
        entityToken: 'loginToken',
        expirationDate: VALID_DATE,
      },
      isLoading: false,
      isError: false,
      loginWithEmail: jest.fn(),
    });

    const { result } = await renderUseSession();

    await waitFor(() => expect(result.current.entityToken).toBe('loginToken'));
    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should logout', async () => {
    mockValidSession();

    const { result } = await renderUseSession();
    expect(result.current.isLoggedIn).toBe(true);
    await act(async () => result.current.logout());

    await waitFor(() => expect(result.current.isLoggedIn).toBe(false));
  });
});
