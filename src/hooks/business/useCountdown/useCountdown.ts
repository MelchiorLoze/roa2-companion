import { type DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

const ONE_SECOND = Duration.fromObject({ seconds: 1 });

export const useCountdown = (expirationDate: DateTime) => {
  const [timeLeft, setTimeLeft] = useState<Duration>();

  useEffect(() => {
    setTimeLeft(expirationDate.diffNow().rescale());

    const interval = ONE_SECOND.setInterval(setTimeLeft, (prev) => prev?.minus(ONE_SECOND).rescale());

    return () => clearInterval(interval);
  }, [expirationDate]);

  return timeLeft;
};
