import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import type { Session } from '../../../types/session';
import { useGetEntityToken } from '../../data/useGetEntityToken/useGetEntityToken';
import { useLoginWithEmail } from '../../data/useLoginWithEmail/useLoginWithEmail';
import { useAuth } from './useAuth';

jest.mock('../../../contexts/SessionContext/SessionContext');
const useSessionMock = jest.mocked(useSession);
const defaultSessionState: ReturnType<typeof useSession> = {
  isValid: false,
  shouldRenew: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

jest.mock('../../data/useLoginWithEmail/useLoginWithEmail');
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);
const defaultLoginWithEmailState: ReturnType<typeof useLoginWithEmail> = {
  session: undefined,
  loginWithEmail: jest.fn(),
  isLoading: false,
  isError: false,
};

jest.mock('../../data/useGetEntityToken/useGetEntityToken');
const useGetEntityTokenMock = jest.mocked(useGetEntityToken);
const defaultGetEntityTokenState: ReturnType<typeof useGetEntityToken> = {
  newSession: undefined,
  renew: jest.fn(),
  isLoading: false,
  isError: false,
};

const renderUseAuth = (props: Parameters<typeof useAuth>[0] = undefined) => {
  return renderHook(() => useAuth(props));
};

describe('useAuth hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionState);
    useLoginWithEmailMock.mockReturnValue(defaultLoginWithEmailState);
    useGetEntityTokenMock.mockReturnValue(defaultGetEntityTokenState);
  });

  it('returns correct initial state', () => {
    const { result } = renderUseAuth();

    expect(result.current.isLoggedIn).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('calls setSession when login data is available', () => {
    const loginSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.utc().plus({ day: 1 }) };
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailState,
      session: loginSession,
    });

    renderUseAuth();

    expect(defaultSessionState.setSession).toHaveBeenCalledWith(loginSession);
  });

  it('updates isLoggedIn when session becomes valid', () => {
    const { result, rerender } = renderUseAuth();
    expect(result.current.isLoggedIn).toBe(false);

    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      isValid: true,
    });

    rerender(undefined);

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('clears the session when calling logout', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      isValid: true,
    });

    const { result } = renderUseAuth();
    act(result.current.logout);

    expect(defaultSessionState.clearSession).toHaveBeenCalledTimes(1);
  });

  it('sets isLoading to true when session is loading', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      isLoading: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to true when login is loading', () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailState,
      isLoading: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes login error state', () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailState,
      isError: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isError).toBe(true);
  });

  it('calls renew when shouldRenew is true and auto refresh is enabled', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      shouldRenew: true,
    });

    renderUseAuth({ enableAutoRefresh: true });

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
  });

  it('does not call renew when shouldRenew is false', () => {
    renderUseAuth({ enableAutoRefresh: true });

    expect(defaultGetEntityTokenState.renew).not.toHaveBeenCalled();
  });

  it('does not call renew when auto refresh is disabled', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionState,
      shouldRenew: true,
    });

    renderUseAuth();

    expect(defaultGetEntityTokenState.renew).not.toHaveBeenCalled();
  });

  it('calls setSession when newSession is available', () => {
    const newSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.utc().plus({ day: 1 }) };
    useGetEntityTokenMock.mockReturnValue({
      ...defaultGetEntityTokenState,
      newSession,
    });

    renderUseAuth();

    expect(defaultSessionState.setSession).toHaveBeenCalledWith(newSession);
  });
});
