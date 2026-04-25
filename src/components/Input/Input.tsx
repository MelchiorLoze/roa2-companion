import { type ComponentProps } from 'react';
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

export const Input = ({
  placeholder,
  autoComplete,
  value,
  hidden,
  onChange,
  errorMessage,
  contextualCTA,
}: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          autoComplete={autoComplete}
          cursorColor={theme.color.white}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.color.weak}
          secureTextEntry={hidden}
          selectionColor={theme.color.itemNameBackground}
          style={styles.input}
          value={value}
        />
      </View>
      {(errorMessage ?? contextualCTA) && (
        <View style={styles.footer}>
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          {contextualCTA && (
            <Pressable onPress={contextualCTA.onPress} role="button" style={styles.contextualCTA}>
              <Text style={styles.contextualCTALabel}>{contextualCTA.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  inputContainer: {
    boxShadow: [
      {
        color: theme.color.dark,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 3,
        spreadDistance: 3,
      },
    ],
  },
  input: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    padding: theme.spacing.s,
    color: theme.color.white,
    backgroundColor: theme.color.dark,
    borderRadius: 1,
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
    color: theme.color.borderLight,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
}));
