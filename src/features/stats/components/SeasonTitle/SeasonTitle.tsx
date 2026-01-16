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
        {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
        colors={theme.color.gradient.seasonTitleWrapper.colors(variant === 'crews')}
        style={styles.wrapper}
      >
        <LinearGradient
          {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
          colors={theme.color.gradient.seasonTitle.colors(variant === 'crews')}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{seasonName}</Text>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ translateX: -theme.spacing.s }, { translateY: -theme.spacing.l }],
  },
  wrapper: {
    paddingVertical: theme.spacing.s,
  },
  titleContainer: {
    flexShrink: 1,
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 22,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
