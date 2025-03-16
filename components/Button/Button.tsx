import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Props = { label: string; onPress: () => void };

export const Button = ({ label, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      {({ pressed }) => <Text style={[styles.label, pressed && styles.labelPressed]}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    width: '25%',
    padding: theme.spacing.s,
    backgroundColor: theme.color.highlight,
  },
  buttonPressed: {
    backgroundColor: theme.color.accent,
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
