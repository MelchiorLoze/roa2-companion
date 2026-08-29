import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { StatRow } from './StatRow';
type Props = {
  readonly rows: { label: string; value: string | number }[];
};

export const StatRows = ({ rows }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerBorder}>
        {rows.map((row) => (
          <StatRow key={row.label} label={row.label} value={row.value} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    borderWidth: 2,
    borderColor: theme.color.statRowsBorder,
    backgroundColor: theme.color.statRowsBackground,
  },
  innerBorder: {
    borderWidth: 3,
    borderColor: theme.color.statRowBackground,
    backgroundColor: theme.color.statRowsBackground,
    paddingVertical: theme.spacing.l,
    gap: theme.spacing.s,
  },
}));
