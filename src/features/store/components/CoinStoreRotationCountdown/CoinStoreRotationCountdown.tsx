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
   * As the digit characters are not the same width, we need to add a transparent placeholder
   * with the widest character (8) to prevent the whole text from jumping every second.
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
        <View>
          <FancyText style={{ ...styles.label, ...styles.countdownPlaceholder }} text={`${hours}:${minutes}:88`} />
          <View style={styles.countdown}>
            <FancyText style={styles.label} text={`${hours}:${minutes}:${seconds}`} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    paddingTop: theme.spacing.m,
    paddingRight: theme.spacing.xxl + theme.spacing.s, // optical correction to compensate the asymmetry of the background image
    paddingBottom: theme.spacing.s,
    paddingLeft: theme.spacing.xxl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  icon: {
    height: 16 * runtime.fontScale,
    aspectRatio: 1,
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
  },
  countdownPlaceholder: {
    color: theme.color.transparent,
  },
}));
