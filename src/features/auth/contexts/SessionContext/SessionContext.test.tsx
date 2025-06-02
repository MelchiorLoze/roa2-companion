import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { useStorageState } from '@/hooks/core/useStorageState/useStorageState';
import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import type { Session } from '../../types/session';
import { SessionProvider, useSession } from './SessionContext';

const VALID_DATE = DateTime.utc().plus({ day: 1 });
const RENEWABLE_DATE = DateTime.utc().plus({ hours: 22 });
const EXPIRED_DATE = DateTime.utc().minus({ day: 1 });

jest.mock('@/hooks/core/useStorageState/useStorageState');
const useStorageStateMock = jest.mocked(useStorageState);

const mockSession = (session: Session | null) => {
  useStorageStateMock.mockImplementation(() => {
    const [state, setState] = useState<unknown>(session);
    return [[state, false], setState];
  });
};

const mockValidSession = () => mockSession({ entityToken: 'validToken', expirationDate: VALID_DATE });
const mockRenewableSession = () => mockSession({ entityToken: 'renewableToken', expirationDate: RENEWABLE_DATE });
const mockExpiredSession = () => mockSession({ entityToken: 'expiredToken', expirationDate: EXPIRED_DATE });
const mockEmptySession = () => mockSession(null);

const Wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryClientProvider>
    <SessionProvider>{children}</SessionProvider>
  </TestQueryClientProvider>
);

const renderUseSession = () => {
  const { result } = renderHook(useSession, { wrapper: Wrapper });
  expect(result.current.isLoading).toBe(false);

  return { result };
};

describe('useSession', () => {
  beforeEach(() => {
    mockEmptySession();
  });

  it('throws an error when not used inside a SessionProvider', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => renderHook(useSession)).toThrow('useSession must be used within a SessionProvider');
    console.error = originalError;
  });

  it('does not be logged in when the storage an login sessions are empty', async () => {
    const { result } = renderUseSession();

    expect(result.current.isValid).toBe(false);
  });

  describe('from storage', () => {
    it('returns true storage contains a valid session', async () => {
      mockValidSession();

      const { result } = renderUseSession();

      expect(result.current.isValid).toBe(true);
      expect(result.current.entityToken).toBe('validToken');
    });

    it('returns false when the storage contains an expired session', async () => {
      mockExpiredSession();

      const { result } = renderUseSession();

      expect(result.current.isValid).toBe(false);
    });
  });

  it('allows to clear session', async () => {
    mockValidSession();

    const { result } = renderUseSession();
    expect(result.current.isValid).toBe(true);
    await act(async () => result.current.clearSession());

    await waitFor(() => expect(result.current.isValid).toBe(false));
  });

  it('allows to setSession to a valid session', async () => {
    mockExpiredSession();

    const { result } = renderUseSession();
    expect(result.current.isValid).toBe(false);
    await act(async () => result.current.setSession({ entityToken: 'validToken', expirationDate: VALID_DATE }));

    await waitFor(() => expect(result.current.isValid).toBe(true));
    expect(result.current.entityToken).toBe('validToken');
  });

  it('does not allow to setSession to an expired session', async () => {
    mockValidSession();

    const { result } = renderUseSession();
    expect(result.current.isValid).toBe(true);
    await act(async () => result.current.setSession({ entityToken: 'expiredToken', expirationDate: EXPIRED_DATE }));

    expect(result.current.isValid).toBe(true);
    expect(result.current.entityToken).toBe('validToken');
  });

  it('asks for renewal when the session is old enough', async () => {
    mockRenewableSession();

    const { result } = renderUseSession();

    expect(result.current.shouldRenew).toBe(true);
  });

  it('does not ask for renewal when the session is not old enough', async () => {
    mockValidSession();

    const { result } = renderUseSession();

    expect(result.current.shouldRenew).toBe(false);
  });

  it('does not ask for renewal when the session is expired', async () => {
    mockExpiredSession();

    const { result } = renderUseSession();

    expect(result.current.shouldRenew).toBe(false);
  });

  it('does not ask for renewal when the session is empty', async () => {
    mockEmptySession();

    const { result } = renderUseSession();

    expect(result.current.shouldRenew).toBe(false);
  });
});
