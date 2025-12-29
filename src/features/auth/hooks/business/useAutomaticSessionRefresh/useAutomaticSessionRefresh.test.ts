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
const defaultSessionReturnValue: ReturnType<typeof useSession> = {
  isValid: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

const newSession: Session = {
  entityToken: 'mock-token',
  expirationDate: DateTime.utc().plus({ day: 1 }),
};
const renewMock = jest.fn();

jest.mock('../../data/useGetEntityToken/useGetEntityToken');
const useGetEntityTokenMock = jest.mocked(useGetEntityToken);
const defaultGetEntityTokenReturnValue: ReturnType<typeof useGetEntityToken> = {
  renew: renewMock,
  isLoading: false,
  isError: false,
};

const renderUseAutomaticSessionRefresh = () => renderHook(useAutomaticSessionRefresh);

describe('useAutomaticSessionRefresh hook', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionReturnValue);
    useGetEntityTokenMock.mockImplementation(({ onSuccess }) => ({
      ...defaultGetEntityTokenReturnValue,
      renew: renewMock.mockImplementation(() => onSuccess?.(newSession)),
    }));
    useAppStateMock.mockReturnValue('inactive');
  });

  it('calls renew when app state is active', () => {
    useAppStateMock.mockReturnValue('active');

    renderUseAutomaticSessionRefresh();

    expect(renewMock).toHaveBeenCalledTimes(1);
    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(newSession);
  });

  it('calls renew when app state is background', () => {
    useAppStateMock.mockReturnValue('background');

    renderUseAutomaticSessionRefresh();

    expect(renewMock).toHaveBeenCalledTimes(1);
    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(newSession);
  });

  it('does not call renew when app state is inactive', () => {
    useAppStateMock.mockReturnValue('inactive');

    renderUseAutomaticSessionRefresh();

    expect(renewMock).not.toHaveBeenCalled();
    expect(defaultSessionReturnValue.setSession).not.toHaveBeenCalled();
  });

  it('throttles renewal calls within 30 minutes', () => {
    useAppStateMock.mockReturnValue('active');

    const { rerender } = renderUseAutomaticSessionRefresh();

    expect(renewMock).toHaveBeenCalledTimes(1);
    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(newSession);
    jest.clearAllMocks();

    useAppStateMock.mockReturnValue('background');
    rerender(undefined);

    expect(renewMock).not.toHaveBeenCalled();
    expect(defaultSessionReturnValue.setSession).not.toHaveBeenCalled();
  });

  it('allows renewal after throttle period expires', () => {
    jest.useFakeTimers();
    useAppStateMock.mockReturnValue('active');

    const { rerender } = renderUseAutomaticSessionRefresh();

    expect(renewMock).toHaveBeenCalledTimes(1);
    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(newSession);
    jest.clearAllMocks();

    jest.advanceTimersByTime(Duration.fromObject({ minutes: 30 }).as('milliseconds'));

    const otherSession: Session = {
      entityToken: 'other-mock-token',
      expirationDate: DateTime.utc().plus({ day: 2 }),
    };
    useGetEntityTokenMock.mockImplementation(({ onSuccess }) => ({
      ...defaultGetEntityTokenReturnValue,
      renew: renewMock.mockImplementation(() => onSuccess?.(otherSession)),
    }));

    useAppStateMock.mockReturnValue('background');
    rerender(undefined);

    expect(renewMock).toHaveBeenCalledTimes(1);
    expect(defaultSessionReturnValue.setSession).toHaveBeenCalledWith(otherSession);
    jest.useRealTimers();
  });
});
