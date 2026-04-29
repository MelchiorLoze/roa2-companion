import { act, renderHook } from '@testing-library/react-native';
import { Duration } from 'luxon';

import { useXpRotationalBonus } from './useXpRotationalBonus';

const BONUS_DURATION = Duration.fromObject({ minutes: 90 }).as('seconds');
const BONUS_DURATION_MS = BONUS_DURATION * 1000;

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
    expect(result.current.expirationDate.toSeconds()).toBe(BONUS_DURATION);
  });

  it('rotates to the next queue when the current bonus expires', () => {
    const { result } = renderHook(useXpRotationalBonus);

    const initialExpirationSeconds = result.current.expirationDate.toSeconds();

    act(() => {
      jest.advanceTimersByTime(BONUS_DURATION_MS);
    });

    expect(result.current.currentQueue).toBe('2v2');
    expect(result.current.expirationDate.toSeconds()).toBe(initialExpirationSeconds + BONUS_DURATION);
  });

  it('keeps rotating through all queues in order', () => {
    const { result } = renderHook(useXpRotationalBonus);

    const initialQueue = result.current.currentQueue;

    act(() => {
      jest.advanceTimersByTime(BONUS_DURATION_MS);
    });
    expect(result.current.currentQueue).toBe('2v2');

    act(() => {
      jest.advanceTimersByTime(BONUS_DURATION_MS);
    });
    expect(result.current.currentQueue).toBe('crews');

    act(() => {
      jest.advanceTimersByTime(BONUS_DURATION_MS);
    });
    expect(result.current.currentQueue).toBe(initialQueue);
  });

  it('schedules the next update based on the remaining duration', () => {
    jest.setSystemTime(new Date('1970-01-01T00:45:00.000Z'));

    const { result } = renderHook(useXpRotationalBonus);

    expect(result.current.currentQueue).toBe('casual');

    const delayMs = result.current.expirationDate.diffNow().as('milliseconds');
    expect(delayMs).toBe(45 * 60 * 1000);

    act(() => {
      jest.advanceTimersByTime(delayMs);
    });

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
