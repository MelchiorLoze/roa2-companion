import { Duration } from 'luxon';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { useXpRotationalBonus } from '@/features/stats/hooks/business/useXpRotationalBonus/useXpRotationalBonus';
import { useCountdown } from '@/hooks/business/useCountdown/useCountdown';

export const XpRotationalBonusBanner = () => {
  const { theme } = useUnistyles();
  const { currentQueue, expirationDate } = useXpRotationalBonus();
  const timeLeft = useCountdown(expirationDate);

  const minutes = Duration.fromObject({ minutes: timeLeft?.minutes }).toFormat('mm');
  const seconds = Duration.fromObject({ seconds: timeLeft?.seconds }).toFormat('ss');

  return (
    <LinearGradient {...theme.color.gradient.xpRotationalBonusBanner} style={styles.container} vertical>
      <View style={styles.bonusContainer}>
        <OutlinedText style={styles.bonusLabel} text={`${currentQueue}: Bonus +50%`.toUpperCase()} />
        <OutlinedText style={styles.bonusUnit} text={'XP'} />
      </View>
      <View style={styles.timeLeftBorder}>
        <LinearGradient {...theme.color.gradient.xpRotationalBonusTimeLeft} style={styles.timeLeftContainer} vertical>
          <OutlinedText style={styles.timeLeftLabel} text={'Ends in:'.toUpperCase()} />
          <Text style={[styles.timeLeftLabel, styles.timeLeftPlaceHolder]}> {minutes}:88</Text>
          <View style={styles.timeLeft}>
            <OutlinedText style={styles.timeLeftLabel} text={`${minutes}:${seconds}`} />
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.xs,
    alignItems: 'center',
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bonusLabel: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 12,
    color: theme.color.white,
    strokeWidth: 1,
  },
  bonusUnit: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 10,
    color: theme.color.white,
    strokeWidth: 1,
  },
  timeLeftBorder: {
    backgroundColor: '#00000059',
    position: 'absolute',
    bottom: 0,
    right: theme.spacing.l,
    padding: 1,
    paddingBottom: 0,
  },
  timeLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
  },
  timeLeft: {
    position: 'absolute',
    top: theme.spacing.xxs,
    right: theme.spacing.xs,
  },
  timeLeftLabel: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 10,
    color: theme.color.white,
    strokeWidth: 1,
  },
  timeLeftPlaceHolder: {
    color: theme.color.transparent,
  },
}));
