import { type DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

export const useCountdown = (expirationDate: DateTime) => {
  const [timeLeft, setTimeLeft] = useState<Duration>();

  useEffect(() => {
    const millisecondsLeft = expirationDate.diffNow().milliseconds;
    setTimeLeft(Duration.fromObject({ hours: 0, minutes: 0, seconds: 0, milliseconds: millisecondsLeft }).normalize());

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev?.minus({ seconds: 1 }).normalize());
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  return timeLeft;
};
