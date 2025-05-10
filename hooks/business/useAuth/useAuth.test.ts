import { useQueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useSession } from '@/contexts';
import { useGetEntityToken, useLoginWithEmail } from '@/hooks/data';
import { Session } from '@/types/session';

import { useAuth } from './useAuth';

jest.mock('@tanstack/react-query');
const queryClientClearMock = jest.fn();
jest.mocked(useQueryClient).mockReturnValue({
  clear: queryClientClearMock,
} as unknown as ReturnType<typeof useQueryClient>);

jest.mock('@/contexts');
const useSessionMock = jest.mocked(useSession);
const setSessionMock = jest.fn();

jest.mock('@/hooks/data');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);
const useGetEntityTokenMock = jest.mocked(useGetEntityToken);

const renderUseAuth = (props: Parameters<typeof useAuth>[0] = undefined) => {
  return renderHook(() => useAuth(props));
};

describe('useAuth hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: false,
    });

    useLoginWithEmailMock.mockReturnValue({
      session: undefined,
      loginWithEmail: jest.fn(),
      isLoading: false,
      isError: false,
    });

    useGetEntityTokenMock.mockReturnValue({
      newSession: undefined,
      renew: jest.fn(),
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    setSessionMock.mockClear();
    queryClientClearMock.mockClear();
  });

  it('should return correct initial state', () => {
    const { result } = renderUseAuth();

    expect(result.current.isLoggedIn).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should call setSession when login data is available', () => {
    const loginSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.utc().plus({ day: 1 }) };
    useLoginWithEmailMock.mockReturnValue({
      session: loginSession,
      loginWithEmail: jest.fn(),
      isLoading: false,
      isError: false,
    });

    renderUseAuth();

    expect(setSessionMock).toHaveBeenCalledWith(loginSession);
  });

  it('should update isLoggedIn when session becomes valid', () => {
    const { result, rerender } = renderUseAuth();
    expect(result.current.isLoggedIn).toBe(false);

    useSessionMock.mockReturnValue({
      isValid: true,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: false,
    });

    rerender(undefined);

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('logout should clear the session', () => {
    useSessionMock.mockReturnValue({
      isValid: true,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: false,
    });

    const { result } = renderUseAuth();
    act(result.current.logout);

    expect(setSessionMock).toHaveBeenCalledWith(null);
    expect(queryClientClearMock).toHaveBeenCalledTimes(1);
  });

  it('should set isLoading to true when session is loading', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to true when login is loading', () => {
    useLoginWithEmailMock.mockReturnValue({
      session: undefined,
      loginWithEmail: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('should expose login error state', () => {
    useLoginWithEmailMock.mockReturnValue({
      session: undefined,
      loginWithEmail: jest.fn(),
      isLoading: false,
      isError: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isError).toBe(true);
  });

  it('should call renew when shouldRenew is true and auto refresh is enabled', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: true,
      setSession: setSessionMock,
      isLoading: false,
    });

    renderUseAuth({ enableAutoRefresh: true });

    expect(useGetEntityTokenMock().renew).toHaveBeenCalledTimes(1);
  });

  it('should not call renew when shouldRenew is false', () => {
    renderUseAuth({ enableAutoRefresh: true });

    expect(useGetEntityTokenMock().renew).not.toHaveBeenCalled();
  });

  it('should not call renew when auto refresh is disabled', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: true,
      setSession: setSessionMock,
      isLoading: false,
    });

    renderUseAuth();

    expect(useGetEntityTokenMock().renew).not.toHaveBeenCalled();
  });

  it('should call setSession when newSession is available', () => {
    const newSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.utc().plus({ day: 1 }) };
    useGetEntityTokenMock.mockReturnValue({
      newSession,
      renew: jest.fn(),
      isLoading: false,
      isError: false,
    });

    renderUseAuth();

    expect(setSessionMock).toHaveBeenCalledWith(newSession);
  });
});
