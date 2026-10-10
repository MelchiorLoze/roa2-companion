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

  it('returns the expected initial queue and expiration date', async () => {
    const { result } = await renderHook(useXpRotationalBonus);

    expect(result.current.currentQueue).toBe('casual');
    expect(result.current.expirationDate.toSeconds()).toBe(BONUS_DURATION.toSeconds());
  });

  it('rotates to the next queue when the current bonus expires', async () => {
    const { result } = await renderHook(useXpRotationalBonus);

    const initialExpirationSeconds = result.current.expirationDate.toSeconds();

    await act(() => jest.advanceTimersByTime(BONUS_DURATION.toMillis()));

    expect(result.current.currentQueue).toBe('2v2');
    expect(result.current.expirationDate.toSeconds()).toBe(initialExpirationSeconds + BONUS_DURATION.toSeconds());
  });

  it('keeps rotating through all queues in order', async () => {
    const { result } = await renderHook(useXpRotationalBonus);

    const initialQueue = result.current.currentQueue;

    await act(() => jest.advanceTimersByTime(BONUS_DURATION.toMillis()));
    expect(result.current.currentQueue).toBe('2v2');

    await act(() => jest.advanceTimersByTime(BONUS_DURATION.toMillis()));
    expect(result.current.currentQueue).toBe('crews');

    await act(() => jest.advanceTimersByTime(BONUS_DURATION.toMillis()));
    expect(result.current.currentQueue).toBe(initialQueue);
  });

  it('schedules the next update based on the remaining duration', async () => {
    jest.setSystemTime(new Date('1970-01-01T00:45:00.000Z'));

    const { result } = await renderHook(useXpRotationalBonus);

    expect(result.current.currentQueue).toBe('casual');

    const delayMs = result.current.expirationDate.diffNow().toMillis();
    expect(delayMs).toBe(BONUS_DURATION.minus({ minutes: 45 }).toMillis());

    await act(() => jest.advanceTimersByTime(delayMs));

    expect(result.current.currentQueue).toBe('2v2');
  });

  it('cleans up scheduled timeout on unmount', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = await renderHook(useXpRotationalBonus);

    await unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    clearTimeoutSpy.mockRestore();
  });
});
