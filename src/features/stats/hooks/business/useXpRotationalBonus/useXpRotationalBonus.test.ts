import { act, renderHook } from '@testing-library/react-native';

import { BONUS_DURATION, useXpRotationalBonus } from './useXpRotationalBonus';

describe('useXpRotationalBonus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('1970-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the expected initial queue and expiration date', () => {
    const { result } = renderHook(useXpRotationalBonus);

    expect(result.current.currentQueue).toBe('casual');
    expect(result.current.expirationDate.toSeconds()).toBe(BONUS_DURATION.as('seconds'));
  });

  it('rotates to the next queue when the current bonus expires', () => {
    const { result } = renderHook(useXpRotationalBonus);

    const initialExpirationSeconds = result.current.expirationDate.toSeconds();

    act(() => jest.advanceTimersByTime(BONUS_DURATION.as('milliseconds')));

    expect(result.current.currentQueue).toBe('2v2');
    expect(result.current.expirationDate.toSeconds()).toBe(initialExpirationSeconds + BONUS_DURATION.as('seconds'));
  });

  it('keeps rotating through all queues in order', () => {
    const { result } = renderHook(useXpRotationalBonus);

    const initialQueue = result.current.currentQueue;

    act(() => jest.advanceTimersByTime(BONUS_DURATION.as('milliseconds')));
    expect(result.current.currentQueue).toBe('2v2');

    act(() => jest.advanceTimersByTime(BONUS_DURATION.as('milliseconds')));
    expect(result.current.currentQueue).toBe('crews');

    act(() => jest.advanceTimersByTime(BONUS_DURATION.as('milliseconds')));
    expect(result.current.currentQueue).toBe(initialQueue);
  });

  it('schedules the next update based on the remaining duration', () => {
    jest.setSystemTime(new Date('1970-01-01T00:45:00.000Z'));

    const { result } = renderHook(useXpRotationalBonus);

    expect(result.current.currentQueue).toBe('casual');

    const delayMs = result.current.expirationDate.diffNow().as('milliseconds');
    expect(delayMs).toBe(BONUS_DURATION.minus({ minutes: 45 }).as('milliseconds'));

    act(() => jest.advanceTimersByTime(delayMs));

    expect(result.current.currentQueue).toBe('2v2');
  });

  it('cleans up scheduled timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(useXpRotationalBonus);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });
});
