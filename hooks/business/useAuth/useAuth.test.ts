import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useSession } from '@/contexts';
import { useGetEntityToken, useLoginWithEmail } from '@/hooks/data';
import { Session } from '@/types/session';

import { useAuth } from './useAuth';

jest.mock('@/contexts');
const useSessionMock = jest.mocked(useSession);
const setSessionMock = jest.fn();

jest.mock('@/hooks/data');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);
const useGetEntityTokenMock = jest.mocked(useGetEntityToken);

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
  });

  it('should return correct initial state', () => {
    const { result } = renderHook(useAuth);

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

    renderHook(useAuth);

    expect(setSessionMock).toHaveBeenCalledWith(loginSession);
  });

  it('should update isLoggedIn when session becomes valid', () => {
    const { result, rerender } = renderHook(useAuth);
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

  it('logout should call setSession with null', () => {
    useSessionMock.mockReturnValue({
      isValid: true,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: false,
    });

    const { result } = renderHook(useAuth);
    act(result.current.logout);

    expect(setSessionMock).toHaveBeenCalledWith(null);
  });

  it('should set isLoading to true when session is loading', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: false,
      setSession: setSessionMock,
      isLoading: true,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to true when login is loading', () => {
    useLoginWithEmailMock.mockReturnValue({
      session: undefined,
      loginWithEmail: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isLoading).toBe(true);
  });

  it('should expose login error state', () => {
    useLoginWithEmailMock.mockReturnValue({
      session: undefined,
      loginWithEmail: jest.fn(),
      isLoading: false,
      isError: true,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isError).toBe(true);
  });

  it('should call renew when shouldRenew is true and auto refresh is enabled', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: true,
      setSession: setSessionMock,
      isLoading: false,
    });

    renderHook(() => useAuth({ enableAutoRefresh: true }));

    expect(useGetEntityTokenMock().renew).toHaveBeenCalledTimes(1);
  });

  it('should not call renew when shouldRenew is false', () => {
    renderHook(() => useAuth({ enableAutoRefresh: true }));

    expect(useGetEntityTokenMock().renew).not.toHaveBeenCalled();
  });

  it('should not call renew when auto refresh is disabled', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      shouldRenew: true,
      setSession: setSessionMock,
      isLoading: false,
    });

    renderHook(() => useAuth({ enableAutoRefresh: false }));

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

    renderHook(useAuth);

    expect(setSessionMock).toHaveBeenCalledWith(newSession);
  });
});
