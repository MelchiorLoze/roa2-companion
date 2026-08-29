import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { FancyText } from '@/components/FancyText/FancyText';

type Props = {
  label: string;
  value: string | number;
};

export const StatRow = ({ label, value }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <FancyText
          style={{ gradient: { ...theme.color.gradient.labelText(), direction: 'vertical' }, ...styles.label }}
          text={label}
        />
      </View>
      <View style={styles.valueContainer}>
        <FancyText
          style={{ gradient: { ...theme.color.gradient.labelText(), direction: 'vertical' }, ...styles.label }}
          text={value.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.color.statRowBackground,
  },
  label: {
    fontFamily: theme.font.primary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    strokeWidth: 1.5,
    strokeColor: theme.color.black,
  },
  labelContainer: {
    width: '50%',
    paddingLeft: theme.spacing.xl,
  },
  valueContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));
