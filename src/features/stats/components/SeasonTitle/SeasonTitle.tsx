import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  seasonName: string;
  variant: 'ranked' | 'crews';
};

export const SeasonTitle = ({ seasonName, variant }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <LinearGradient
        {...theme.color.gradient.coordinates({ direction: 'horizontal', end: 0.8 })}
        colors={theme.color.gradient.seasonTitleWrapper.colors(variant === 'crews')}
        style={styles.wrapper}
      >
        <LinearGradient
          {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
          colors={theme.color.gradient.seasonTitleLeftToRight.colors(variant === 'crews')}
          style={styles.titleBackground}
        />
        <LinearGradient
          {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
          colors={theme.color.gradient.seasonTitleRightToLeft.colors(variant === 'crews')}
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
