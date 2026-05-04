import { Duration, type DurationObjectUnits } from 'luxon';

declare module 'luxon' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Duration {
    toSeconds(): number;

    setTimeout<TArgs extends unknown[]>(
      callback: (...args: TArgs) => void,
      ...args: TArgs
    ): ReturnType<typeof setTimeout>;

    setInterval<TArgs extends unknown[]>(
      callback: (...args: TArgs) => void,
      ...args: TArgs
    ): ReturnType<typeof setInterval>;

    extract(unit: keyof DurationObjectUnits): Duration;
  }
}

Duration.prototype.toSeconds = function (): number {
  return this.as('seconds');
};

Duration.prototype.setTimeout = function <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  ...args: TArgs
): ReturnType<typeof setTimeout> {
  const delayMs = this.toMillis();

  if (!Number.isFinite(delayMs)) throw new RangeError('Cannot schedule a timeout from an invalid Duration');

  return globalThis.setTimeout(callback, Math.max(0, delayMs), ...args);
};

Duration.prototype.setInterval = function <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  ...args: TArgs
): ReturnType<typeof setInterval> {
  const delayMs = this.toMillis();

  if (!Number.isFinite(delayMs)) throw new RangeError('Cannot schedule an interval from an invalid Duration');

  return globalThis.setInterval(callback, Math.max(0, delayMs), ...args);
};

Duration.prototype.extract = function (unit: keyof DurationObjectUnits): Duration {
  const asUnit = this.toObject()[unit] ?? 0;
  return Duration.fromObject({ [unit]: asUnit });
};

export {};
