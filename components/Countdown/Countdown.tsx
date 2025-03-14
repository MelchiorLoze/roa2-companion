import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const Countdown = ({ date, style }: { date?: DateTime; style: StyleProp<TextStyle> }) => {
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

  const hours = timeLeft?.toFormat('hh');
  const minutes = Duration.fromObject({ minutes: timeLeft?.minutes }).toFormat('mm');
  const seconds = Duration.fromObject({ seconds: timeLeft?.seconds }).toFormat('ss');

  return (
    <View style={styles.container}>
      <Text style={style}>
        {hours}h {minutes}m {seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 120,
  },
});
