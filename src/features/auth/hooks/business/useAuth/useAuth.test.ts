import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { type Session } from '../../../types/session';
import { useLoginWithEmail } from '../../data/useLoginWithEmail/useLoginWithEmail';
import { useAuth } from './useAuth';

jest.mock('../../../contexts/SessionContext/SessionContext');
jest.mock('../../data/useLoginWithEmail/useLoginWithEmail');

const useSessionMock = jest.mocked(useSession);
const useLoginWithEmailMock = jest.mocked(useLoginWithEmail);

const defaultSessionReturnValue: ReturnType<typeof useSession> = {
  isValid: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

const defaultLoginWithEmailReturnValue: ReturnType<typeof useLoginWithEmail> = {
  session: undefined,
  loginWithEmail: jest.fn(),
  isLoading: false,
  isError: false,
};

const renderUseAuth = () => renderHook(useAuth);

describe('useAuth hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionReturnValue);
    useLoginWithEmailMock.mockReturnValue(defaultLoginWithEmailReturnValue);
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
      ...defaultLoginWithEmailReturnValue,
      session: loginSession,
    });

    renderUseAuth();

    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(loginSession);
  });

  it('updates isLoggedIn when session becomes valid', () => {
    const { result, rerender } = renderUseAuth();
    expect(result.current.isLoggedIn).toBe(false);

    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isValid: true,
    });

    rerender(undefined);

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('clears the session when calling logout', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isValid: true,
    });

    const { result } = renderUseAuth();
    act(result.current.logout);

    expect(defaultSessionReturnValue.clearSession).toHaveBeenCalledTimes(1);
  });

  it('sets isLoading to true when session is loading', () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isLoading: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to true when login is loading', () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailReturnValue,
      isLoading: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes login error state', () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailReturnValue,
      isError: true,
    });

    const { result } = renderUseAuth();

    expect(result.current.isError).toBe(true);
  });
});
