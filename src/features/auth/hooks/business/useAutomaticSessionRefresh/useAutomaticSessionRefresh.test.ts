import { renderHook } from '@testing-library/react-native';
import { DateTime, Duration } from 'luxon';

import { useAppState } from '@/hooks/core/useAppState/useAppState';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { type Session } from '../../../types/session';
import { useGetEntityToken } from '../../data/useGetEntityToken/useGetEntityToken';
import { useAutomaticSessionRefresh } from './useAutomaticSessionRefresh';

jest.mock('@/hooks/core/useAppState/useAppState');
const useAppStateMock = jest.mocked(useAppState);

jest.mock('../../../contexts/SessionContext/SessionContext');
const useSessionMock = jest.mocked(useSession);
const defaultSessionState: ReturnType<typeof useSession> = {
  isValid: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

jest.mock('../../data/useGetEntityToken/useGetEntityToken');
const useGetEntityTokenMock = jest.mocked(useGetEntityToken);
const defaultGetEntityTokenState: ReturnType<typeof useGetEntityToken> = {
  newSession: undefined,
  renew: jest.fn(),
  isLoading: false,
  isError: false,
};

const renderUseAutomaticSessionRefresh = () => renderHook(useAutomaticSessionRefresh);

describe('useAutomaticSessionRefresh hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionState);
    useGetEntityTokenMock.mockReturnValue(defaultGetEntityTokenState);
    useAppStateMock.mockReturnValue('unknown');
  });

  it('calls setSession when newSession is available', () => {
    const newSession: Session = {
      entityToken: 'mock-token',
      expirationDate: DateTime.utc().plus({ day: 1 }),
    };

    useGetEntityTokenMock.mockReturnValue({
      ...defaultGetEntityTokenState,
      newSession,
    });

    renderUseAutomaticSessionRefresh();

    expect(defaultSessionState.setSession).toHaveBeenCalledWith(newSession);
  });

  it('does not call setSession when newSession is undefined', () => {
    renderUseAutomaticSessionRefresh();

    expect(defaultSessionState.setSession).not.toHaveBeenCalled();
  });

  it('calls renew when app state is active', () => {
    useAppStateMock.mockReturnValue('active');

    renderUseAutomaticSessionRefresh();

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
  });

  it('calls renew when app state is background', () => {
    useAppStateMock.mockReturnValue('background');

    renderUseAutomaticSessionRefresh();

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
  });

  it('does not call renew when app state is inactive', () => {
    useAppStateMock.mockReturnValue('inactive');

    renderUseAutomaticSessionRefresh();

    expect(defaultGetEntityTokenState.renew).not.toHaveBeenCalled();
  });

  it('throttles renewal calls within 30 minutes', () => {
    useAppStateMock.mockReturnValue('active');

    const { rerender } = renderUseAutomaticSessionRefresh();

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();

    useAppStateMock.mockReturnValue('background');
    rerender(undefined);

    expect(defaultGetEntityTokenState.renew).not.toHaveBeenCalled();
  });

  it('allows renewal after throttle period expires', () => {
    jest.useFakeTimers();
    useAppStateMock.mockReturnValue('active');

    const { rerender } = renderUseAutomaticSessionRefresh();

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();

    jest.advanceTimersByTime(Duration.fromObject({ minutes: 30 }).as('milliseconds'));

    useAppStateMock.mockReturnValue('background');
    rerender(undefined);

    expect(defaultGetEntityTokenState.renew).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
