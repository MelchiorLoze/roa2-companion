import { Image, ImageBackground } from 'expo-image';
import { type DateTime } from 'luxon';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { CoinStoreRotationCountdownBackground } from '@/assets/images/ui';
import { TimeIcon } from '@/assets/images/ui/icons';
import { FancyText } from '@/components/FancyText/FancyText';
import { useCountdown } from '@/hooks/business/useCountdown/useCountdown';

type Props = { expirationDate: DateTime };

export const CoinStoreRotationCountdown = ({ expirationDate }: Readonly<Props>) => {
  const timeLeft = useCountdown(expirationDate);

  const hours = timeLeft.toFormat('hh');
  const minutes = timeLeft.extract('minutes').toFormat('mm');
  const seconds = timeLeft.extract('seconds').toFormat('ss');

  /*
   * As the countdown is aligned on the right and the digits characters are not the same width,
   * we need to add a transparent placeholder with the widest character (8) to prevent the
   * whole text from jumping every second.
   */
  return (
    <View style={styles.container}>
      <ImageBackground
        contentFit="fill"
        source={CoinStoreRotationCountdownBackground}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Image source={TimeIcon} style={styles.icon} />
        <View style={styles.countdown}>
          <FancyText style={styles.label} text={`${hours}:${minutes}:${seconds}`} />
        </View>
        <FancyText style={{ ...styles.label, ...styles.countdownPlaceholder }} text={`${hours}:${minutes}:88`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.m,
    paddingRight: theme.spacing.xxl + theme.spacing.s, // optical correction to compensate the asymmetry of the background image
  },
  content: {
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
  icon: {
    width: 18,
    height: 18,
  },
  label: {
    fontFamily: theme.font.secondary.black,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
    skew: -0.2,
  },
  countdown: {
    position: 'absolute',
    right: 0,
  },
  countdownPlaceholder: {
    color: theme.color.transparent,
  },
}));
