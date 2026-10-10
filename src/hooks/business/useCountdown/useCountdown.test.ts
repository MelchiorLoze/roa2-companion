import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial time left for a future expiration date', async () => {
    const expirationDate = DateTime.utc().plus({ hours: 2, minutes: 30, seconds: 45 });

    const { result } = await renderHook(() => useCountdown(expirationDate));

    expect(result.current.hours).toBe(2);
    expect(result.current.minutes).toBe(30);
    expect(result.current.seconds).toBe(45);
  });

  it('returns zero hours when expiration is less than an hour away', async () => {
    const expirationDate = DateTime.utc().plus({ minutes: 45, seconds: 20 });

    const { result } = await renderHook(() => useCountdown(expirationDate));

    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(45);
    expect(result.current.seconds).toBe(20);
  });

  it('clamps to zero when expiration is in the past', async () => {
    const expirationDate = DateTime.utc().minus({ seconds: 10 });

    const { result } = await renderHook(() => useCountdown(expirationDate));

    expect(result.current.toMillis()).toBe(0);
  });

  it('decrements by one second each interval tick', async () => {
    const expirationDate = DateTime.utc().plus({ minutes: 5, seconds: 10 });

    const { result } = await renderHook(() => useCountdown(expirationDate));

    expect(result.current.seconds).toBe(10);

    await act(() => jest.advanceTimersByTime(1000));

    expect(result.current.seconds).toBe(9);
  });

  it('carries over correctly when seconds reach zero', async () => {
    const expirationDate = DateTime.utc().plus({ minutes: 1, seconds: 0 });

    const { result } = await renderHook(() => useCountdown(expirationDate));

    await act(() => jest.advanceTimersByTime(1000));

    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(59);
  });

  it('cleans up the interval on unmount', async () => {
    const expirationDate = DateTime.utc().plus({ hours: 1 });
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = await renderHook(() => useCountdown(expirationDate));

    await unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });

  it('resets the countdown when expiration date changes', async () => {
    const firstDate = DateTime.utc().plus({ minutes: 5 });
    const secondDate = DateTime.utc().plus({ minutes: 10 });

    const { result, rerender } = await renderHook(({ date }: { date: DateTime }) => useCountdown(date), {
      initialProps: { date: firstDate },
    });

    expect(result.current.minutes).toBe(5);

    await rerender({ date: secondDate });

    expect(result.current.minutes).toBe(10);
  });
});
