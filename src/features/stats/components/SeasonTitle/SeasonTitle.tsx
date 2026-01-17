import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';

type Props = {
  seasonName: string;
  variant: 'ranked' | 'crews';
};

export const SeasonTitle = ({ seasonName, variant }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <LinearGradient
        {...theme.color.gradient.seasonTitleWrapper(variant === 'crews')}
        horizontal
        style={styles.wrapper}
      >
        <LinearGradient
          {...theme.color.gradient.seasonTitleLeftToRight(variant === 'crews')}
          horizontal
          style={styles.titleBackground}
        />
        <LinearGradient
          {...theme.color.gradient.seasonTitleRightToLeft(variant === 'crews')}
          horizontal
          style={styles.titleBackground}
        />
        <Text style={styles.title}>{seasonName}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ translateX: -theme.spacing.s }, { translateY: '-50%' }],
  },
  wrapper: {
    paddingVertical: theme.spacing.s,
  },
  titleBackground: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    left: 0,
    right: 0,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 22,
    color: theme.color.white,
    textTransform: 'uppercase',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
  },
}));
