import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '../LinearGradient/LinearGradient';

type Props = { label: string; onPress: () => void };

export const Button = ({ label, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button">
      {({ pressed }) => (
        <>
          <LinearGradient {...theme.color.gradient.button(pressed)} horizontal style={styles.button}>
            <Text style={[styles.label, pressed && styles.labelPressed]}>{label}</Text>
          </LinearGradient>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  labelPressed: {
    color: theme.color.black,
  },
}));
