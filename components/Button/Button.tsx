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
    backgroundColor: theme.color.highlight,
    padding: theme.spacing.s,
    width: '25%',
  },
  buttonPressed: {
    backgroundColor: theme.color.accent,
  },
  label: {
    color: theme.color.white,
    fontSize: 16,
    fontFamily: theme.font.primary.regular,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  labelPressed: {
    color: theme.color.black,
  },
}));
