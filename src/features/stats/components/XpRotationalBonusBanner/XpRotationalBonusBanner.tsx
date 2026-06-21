import { Image } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ClockIcon } from '@/assets/images/ui/icons';
import { FancyText } from '@/components/FancyText/FancyText';
import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { useXpRotationalBonus } from '@/features/stats/hooks/business/useXpRotationalBonus/useXpRotationalBonus';
import { useCountdown } from '@/hooks/business/useCountdown/useCountdown';

export const XpRotationalBonusBanner = () => {
  const { theme } = useUnistyles();
  const { currentQueue, expirationDate } = useXpRotationalBonus();
  const timeLeft = useCountdown(expirationDate);

  const minutes = timeLeft.toFormat('mm');
  const seconds = timeLeft.extract('seconds').toFormat('ss');

  return (
    <LinearGradient {...theme.color.gradient.xpRotationalBonusBanner} style={styles.container} vertical>
      <View style={styles.bonusContainer}>
        <FancyText style={styles.bonusLabel} text={`${currentQueue} — Bonus +50%`.toUpperCase()} />
        <FancyText style={styles.bonusUnit} text={'XP'} />
      </View>

      <View style={styles.timeLeftBorder}>
        <LinearGradient {...theme.color.gradient.xpRotationalBonusTimeLeft} style={styles.timeLeftContainer} vertical>
          <FancyText style={styles.timeLeftLabel} text={'Ends in:'.toUpperCase()} />

          <View style={styles.timeLeft}>
            <Image source={ClockIcon} style={styles.clockIcon} />
            <View>
              <FancyText style={{ ...styles.timeLeftLabel, ...styles.timeLeftPlaceHolder }} text={`${minutes}:88`} />
              <View style={styles.timeLeftLabelContainer}>
                <FancyText style={styles.timeLeftLabel} text={`${minutes}:${seconds}`} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
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
    strokeColor: theme.color.black,
  },
  bonusUnit: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 10,
    color: theme.color.white,
    strokeWidth: 1,
    strokeColor: theme.color.black,
  },
  timeLeftBorder: {
    backgroundColor: theme.color.translucentBorder,
    position: 'absolute',
    bottom: 0,
    right: theme.spacing.l,
    padding: 1,
    paddingBottom: 0,
  },
  timeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.xs,
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLeftLabelContainer: {
    position: 'absolute',
  },
  timeLeftLabel: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 10,
    color: theme.color.white,
    strokeWidth: 1,
    strokeColor: theme.color.black,
  },
  timeLeftPlaceHolder: {
    color: theme.color.transparent,
    strokeColor: theme.color.transparent,
  },
  clockIcon: {
    height: 10 * runtime.fontScale,
    aspectRatio: 1,
  },
}));
