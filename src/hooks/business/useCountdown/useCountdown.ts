import { type DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

const ONE_SECOND = Duration.fromObject({ seconds: 1 });

const clampedTimeLeft = (expirationDate: DateTime) =>
  Duration.fromMillis(Math.max(0, expirationDate.diffNow().toMillis())).rescale();

export const useCountdown = (expirationDate: DateTime) => {
  const [timeLeft, setTimeLeft] = useState<Duration>(clampedTimeLeft(expirationDate));

  useEffect(() => {
    setTimeLeft(clampedTimeLeft(expirationDate));
    const interval = ONE_SECOND.setInterval(setTimeLeft, () => clampedTimeLeft(expirationDate));

    return () => clearInterval(interval);
  }, [expirationDate]);

  return timeLeft;
};
