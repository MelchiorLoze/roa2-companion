import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

export const Tab = ({ title, selected, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable disabled={selected} onPress={onPress} style={styles.container}>
      <LinearGradient
        {...theme.color.gradient.coordinates({ direction: 'vertical' })}
        colors={theme.color.gradient.tab.colors}
        style={styles.inner}
      >
        <Text style={styles.label(selected)}>{title}</Text>
      </LinearGradient>
      {selected && (
        <>
          <LinearGradient
            {...theme.color.gradient.coordinates({ direction: 'vertical' })}
            colors={theme.color.gradient.tabSelectedOverlay.colors}
            style={styles.selectedOverlay}
          />
          <LinearGradient
            {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
            colors={theme.color.gradient.tabSelectedGoldAccent.colors}
            locations={theme.color.gradient.tabSelectedGoldAccent.times}
            style={styles.underline}
          />
          <LinearGradient
            {...theme.color.gradient.coordinates({ direction: 'horizontal' })}
            colors={theme.color.gradient.tabSelectedWhiteAccent.colors}
            locations={theme.color.gradient.tabSelectedWhiteAccent.times}
            style={styles.underline}
          />
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
