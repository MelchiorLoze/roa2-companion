import { Duration } from 'luxon';

describe('LuxonDurationExtension', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('converts a duration to seconds', () => {
    const duration = Duration.fromObject({ minutes: 1, seconds: 30 });

    expect(duration.toSeconds()).toBe(90);
  });

  it('schedules a timeout using the duration in milliseconds', () => {
    const callback = jest.fn();
    const duration = Duration.fromMillis(50);

    duration.setTimeout(callback, 'tick', 1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(49);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledWith('tick', 1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('clamps negative timeout durations to zero', () => {
    const callback = jest.fn();
    const duration = Duration.fromMillis(-10);

    duration.setTimeout(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('throws when scheduling a timeout from an invalid duration', () => {
    const duration = Duration.invalid('invalid timeout');

    expect(() => duration.setTimeout(jest.fn())).toThrow(RangeError);
    expect(() => duration.setTimeout(jest.fn())).toThrow('Cannot schedule a timeout from an invalid Duration');
  });

  it('schedules an interval using the duration in milliseconds', () => {
    const callback = jest.fn();
    const duration = Duration.fromMillis(100);

    const intervalId = duration.setInterval(callback, 'pulse');

    jest.advanceTimersByTime(350);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, 'pulse');
    expect(callback).toHaveBeenNthCalledWith(2, 'pulse');
    expect(callback).toHaveBeenNthCalledWith(3, 'pulse');

    clearInterval(intervalId);
  });

  it('throws when scheduling an interval from an invalid duration', () => {
    const duration = Duration.invalid('invalid interval');

    expect(() => duration.setInterval(jest.fn())).toThrow(RangeError);
    expect(() => duration.setInterval(jest.fn())).toThrow('Cannot schedule an interval from an invalid Duration');
  });

  it('extracts a single unit from a duration', () => {
    const duration = Duration.fromObject({ hours: 2, minutes: 45, seconds: 30 });

    const extracted = duration.extract('minutes');

    expect(extracted.toObject()).toEqual({ minutes: 45 });
    expect(extracted.as('seconds')).toBe(2700);
  });

  it('returns zero when extracting a unit that does not exist in the duration object', () => {
    const duration = Duration.fromObject({ minutes: 15 });

    const extracted = duration.extract('hours');

    expect(extracted.as('hours')).toBe(0);
  });
});
