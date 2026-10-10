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

const renderUseAuth = async () => await renderHook(useAuth);

describe('useAuth hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionReturnValue);
    useLoginWithEmailMock.mockReturnValue(defaultLoginWithEmailReturnValue);
  });

  it('returns correct initial state', async () => {
    const { result } = await renderUseAuth();

    expect(result.current.isLoggedIn).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('calls setSession when login data is available', async () => {
    const loginSession: Session = { entityToken: 'mock-token', expirationDate: DateTime.utc().plus({ day: 1 }) };
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailReturnValue,
      session: loginSession,
    });

    await renderUseAuth();

    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(loginSession);
  });

  it('updates isLoggedIn when session becomes valid', async () => {
    const { result, rerender } = await renderUseAuth();
    expect(result.current.isLoggedIn).toBe(false);

    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isValid: true,
    });

    await rerender(undefined);

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('clears the session when calling logout', async () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isValid: true,
    });

    const { result } = await renderUseAuth();
    await act(result.current.logout);

    expect(defaultSessionReturnValue.clearSession).toHaveBeenCalledTimes(1);
  });

  it('sets isLoading to true when session is loading', async () => {
    useSessionMock.mockReturnValue({
      ...defaultSessionReturnValue,
      isLoading: true,
    });

    const { result } = await renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to true when login is loading', async () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailReturnValue,
      isLoading: true,
    });

    const { result } = await renderUseAuth();

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes login error state', async () => {
    useLoginWithEmailMock.mockReturnValue({
      ...defaultLoginWithEmailReturnValue,
      isError: true,
    });

    const { result } = await renderUseAuth();

    expect(result.current.isError).toBe(true);
  });
});
