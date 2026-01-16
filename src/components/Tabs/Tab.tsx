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
        {...theme.color.gradient.properties({ direction: 'vertical' })}
        colors={theme.color.tabGradient(selected)}
        style={styles.inner}
      >
        <Text style={styles.label(selected)}>{title}</Text>
      </LinearGradient>
      {selected && (
        <LinearGradient
          {...theme.color.gradient.properties({ direction: 'horizontal' })}
          colors={theme.color.tabUnderlineGradient}
          locations={[0, 1 / 3, 2 / 3, 1]}
          style={styles.underline}
        />
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
  underline: {
    position: 'absolute',
    height: 2,
    width: '100%',
    bottom: 0,
  },
}));
