import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useSession } from '@/contexts';
import { useLoginWithEmail } from '@/hooks/data';
import { Session } from '@/types/session';

import { useAuth } from './useAuth';

jest.mock('@/contexts');
const useSessionMock = jest.mocked(useSession);
const setSessionMock = jest.fn();

jest.mock('@/hooks/data');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);

describe('useAuth hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({
      isValid: false,
      setSession: setSessionMock,
      isLoading: false,
    });

    useLoginWithEmailMock.mockReturnValue({
      data: undefined,
      loginWithEmail: jest.fn(),
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
    const loginSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.now().plus({ day: 1 }) };
    useLoginWithEmailMock.mockReturnValue({
      data: loginSession,
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
      setSession: setSessionMock,
      isLoading: false,
    });

    rerender(undefined);

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('logout should call setSession with null', () => {
    useSessionMock.mockReturnValue({
      isValid: true,
      setSession: setSessionMock,
      isLoading: false,
    });

    const { result } = renderHook(useAuth);
    act(() => result.current.logout());

    expect(setSessionMock).toHaveBeenCalledWith(null);
  });

  it('should set isLoading to true when session is loading', () => {
    useSessionMock.mockReturnValue({
      isValid: false,
      setSession: setSessionMock,
      isLoading: true,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to true when login is loading', () => {
    useLoginWithEmailMock.mockReturnValue({
      data: undefined,
      loginWithEmail: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isLoading).toBe(true);
  });

  it('should expose login error state', () => {
    useLoginWithEmailMock.mockReturnValue({
      data: undefined,
      loginWithEmail: jest.fn(),
      isLoading: false,
      isError: true,
    });

    const { result } = renderHook(useAuth);

    expect(result.current.isError).toBe(true);
  });
});
