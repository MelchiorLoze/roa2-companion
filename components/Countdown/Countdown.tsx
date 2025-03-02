import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export const Countdown = ({ date }: { date?: DateTime }) => {
  const [timeLeft, setTimeLeft] = useState<Duration>();

  useEffect(() => {
    if (!date) return;

    const millisecondsLeft = date.diffNow().milliseconds;
    setTimeLeft(Duration.fromObject({ hours: 0, minutes: 0, seconds: 0, milliseconds: millisecondsLeft }).normalize());

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev?.minus({ seconds: 1 }).normalize());
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <Text>
      {timeLeft?.hours}h {timeLeft?.minutes}m {timeLeft?.seconds}s
    </Text>
  );
};
