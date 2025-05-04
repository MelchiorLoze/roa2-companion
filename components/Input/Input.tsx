import { ComponentProps } from 'react';
import { TextInput } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = Pick<ComponentProps<typeof TextInput>, 'placeholder' | 'autoComplete'> & {
  value: string;
  hidden?: boolean;
  onChange: (text: string) => void;
};

export const Input = ({ placeholder, autoComplete, value, hidden, onChange }: Props) => {
  const { theme } = useUnistyles();

  return (
    <TextInput
      autoCapitalize="none"
      autoComplete={autoComplete}
      cursorColor={theme.color.white}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={theme.color.weak}
      secureTextEntry={hidden}
      style={styles.input}
      value={value}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  input: {
    width: '100%',
    height: 40,
    padding: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.color.accent,
    color: theme.color.white,
    backgroundColor: theme.color.dark,
  },
}));
