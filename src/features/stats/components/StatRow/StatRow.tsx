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
    <View style={styles.container}>
      <LinearGradient colors={theme.color.statLabelGradient} end={[1, 0]} start={[0, 0]} style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
      <View style={styles.separator} />
      <LinearGradient colors={theme.color.statValueGradient} end={[1, 0]} start={[0, 0]} style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </LinearGradient>
    </View>
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
  labelContainer: {
    width: '60%',
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
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
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
  },
  value: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.stat,
  },
}));
