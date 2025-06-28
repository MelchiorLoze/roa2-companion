import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = { label: string; onPress: () => void };

export const Button = ({ label, onPress }: Props) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button">
      {({ pressed }) => (
        <>
          <LinearGradient
            colors={theme.color.buttonGradient(pressed)}
            end={[1, 0]}
            start={[0, 0]}
            style={styles.button}
          >
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
