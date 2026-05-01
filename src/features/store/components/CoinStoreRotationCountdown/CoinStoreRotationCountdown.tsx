import { type DateTime, Duration } from 'luxon';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { useCountdown } from '@/hooks/business/useCountdown/useCountdown';

type Props = { expirationDate: DateTime };

export const CoinStoreRotationCountdown = ({ expirationDate }: Readonly<Props>) => {
  const { theme } = useUnistyles();
  const timeLeft = useCountdown(expirationDate);

  const hours = timeLeft?.toFormat('hh');
  const minutes = Duration.fromObject({ minutes: timeLeft?.minutes }).toFormat('mm');
  const seconds = Duration.fromObject({ seconds: timeLeft?.seconds }).toFormat('ss');

  /*
   * As the countdown is aligned on the right and the digits characters are not the same width,
   * we need to add a transparent placeholder with the widest character (8) to prevent the
   * whole text from jumping every second.
   */
  return (
    <LinearGradient {...theme.color.gradient.storeCountdown} horizontal style={styles.container}>
      <Text style={styles.label}>Items refresh in:</Text>
      <View>
        <Text style={[styles.label, styles.countdown]}>
          {hours}h {minutes}m {seconds}s
        </Text>
        <Text style={[styles.label, styles.countdownPlaceholder]}>
          {hours}h {minutes}m 88s
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    minWidth: '90%',
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  countdown: {
    position: 'absolute',
    right: 0,
  },
  countdownPlaceholder: {
    color: theme.color.transparent,
  },
}));
