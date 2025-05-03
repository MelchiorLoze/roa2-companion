import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const TimeCountdown = ({ date, style }: { date: DateTime; style?: StyleProp<TextStyle> }) => {
  const [timeLeft, setTimeLeft] = useState<Duration>();

  useEffect(() => {
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

  /*
   * Zs the countdown is aligned on the right and the digits characters are not the same width,
   * we need to add a transparent placeholder with the widest character (0) to prevent the
   * whole text from jumping every second.
   */
  return (
    <View>
      <Text style={[style, styles.label]}>
        {hours}h {minutes}m {seconds}s
      </Text>
      <Text style={[style, styles.widthPlaceholder]}>
        {hours}h {minutes}m 00s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  label: {
    position: 'absolute',
    right: 0,
  },
  widthPlaceholder: {
    color: theme.color.transparent,
  },
}));
