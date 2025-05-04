import { ComponentProps } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type ContextualCTA = {
  label: string;
  onPress: () => void;
};

type Props = Pick<ComponentProps<typeof TextInput>, 'placeholder' | 'autoComplete'> & {
  value: string;
  hidden?: boolean;
  onChange: (text: string) => void;
  errorMessage?: string;
  contextualCTA?: ContextualCTA;
};

export const Input = ({ placeholder, autoComplete, value, hidden, onChange, errorMessage, contextualCTA }: Props) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
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
      <View style={styles.footer}>
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        {contextualCTA && (
          <Pressable onPress={contextualCTA.onPress} role="button" style={styles.contextualCTA}>
            <Text style={styles.contextualCTALabel}>{contextualCTA.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.s,
  },
  input: {
    width: '100%',
    height: 40,
    padding: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.color.accent,
    color: theme.color.white,
    backgroundColor: theme.color.dark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  errorMessage: {
    fontFamily: theme.font.primary.regular,
    fontSize: 14,
    color: theme.color.error,
  },
  contextualCTA: {
    flex: 1,
    padding: theme.spacing.xs,
  },
  contextualCTALabel: {
    fontFamily: theme.font.primary.italic,
    fontSize: 14,
    color: theme.color.border,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
}));
