import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '../LinearGradient/LinearGradient';

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

export const Tab = ({ title, selected, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable disabled={selected} onPress={onPress} style={styles.container}>
      <LinearGradient {...theme.color.gradient.tab} style={styles.inner} vertical>
        <Text style={styles.label(selected)}>{title}</Text>
      </LinearGradient>
      {selected && (
        <>
          <LinearGradient {...theme.color.gradient.tabSelectedOverlay} style={styles.selectedOverlay} vertical />
          <LinearGradient {...theme.color.gradient.tabSelectedGoldAccent} horizontal style={styles.underline} />
          <LinearGradient {...theme.color.gradient.tabSelectedWhiteAccent} horizontal style={styles.underline} />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  inner: {
    paddingVertical: theme.spacing.s,
  },
  label: (selected: boolean) => ({
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    textAlign: 'center',
    color: selected ? theme.color.accent : theme.color.inactiveLight,
    textTransform: 'uppercase',
  }),
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  underline: {
    position: 'absolute',
    height: 2,
    right: 0,
    bottom: 0,
    left: 0,
  },
}));
