import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  label: string;
  value: string | number;
};

export const StatRow = ({ label, value }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient
      {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
      colors={theme.color.gradient.statRowBackground.colors}
      style={styles.container}
    >
      <LinearGradient
        {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
        colors={theme.color.gradient.statRowOverlay.colors}
        style={[styles.subContainer, styles.labelContainer]}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
      <View style={styles.separator} />
      <View style={[styles.subContainer, styles.valueContainer]}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    boxShadow: [
      {
        color: theme.color.translucentDark,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 5,
        spreadDistance: 0,
      },
    ],
  },
  subContainer: {
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  labelContainer: {
    width: '60%',
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  separator: {
    width: theme.spacing.xs,
    backgroundColor: theme.color.stat,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.stat,
  },
}));
