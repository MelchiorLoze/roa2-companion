import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, Spinner } from '@/components';
import { useAuth } from '@/hooks/business';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const { login, isLoggedIn, isLoading, isError } = useAuth();
  const { theme } = useUnistyles();
  const router = useRouter();

  if (isLoading) return <Spinner />;

  if (isLoggedIn) return <Redirect href="/store" />;

  const onSubmit = () => {
    if (!email || !password) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);
    login({ email, password });
  };

  return (
    <>
      <Ionicons.Button
        backgroundColor={theme.color.transparent}
        iconStyle={styles.aboutButtonIcon}
        name="information-circle-sharp"
        onPress={() => router.navigate('/about')}
        style={styles.aboutButton}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Login to your{'\n'}ingame account</Text>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={setEmail}
            placeholder="EMAIL"
            placeholderTextColor={theme.color.weak}
            style={styles.input}
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="current-password"
            onChangeText={setPassword}
            placeholder="PASSWORD"
            placeholderTextColor={theme.color.weak}
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <View style={styles.formFooter}>
            {(isError || isInvalid) && <Text style={styles.errorMessage}>Invalid email or password</Text>}
            <Pressable style={styles.forgottenPasswordButton}>
              <Text style={styles.forgottenPasswordLabel}>Forgot your password?</Text>
            </Pressable>
          </View>
        </View>
        <Button label="Login" onPress={onSubmit} />
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
    backgroundColor: theme.color.background,
  },
  aboutButton: {
    padding: theme.spacing.l,
    alignSelf: 'flex-end',
  },
  aboutButtonIcon: {
    fontSize: 32,
    marginRight: 0,
  },
  form: {
    width: '100%',
    gap: theme.spacing.l,
  },
  title: {
    width: '100%',
    fontFamily: theme.font.primary.italic,
    fontSize: 24,
    color: theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
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
  formFooter: {
    marginTop: -theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing.s,
  },
  errorMessage: {
    fontFamily: theme.font.primary.regular,
    fontSize: 14,
    color: theme.color.error,
  },
  forgottenPasswordButton: {
    flex: 1,
    padding: theme.spacing.xs,
  },
  forgottenPasswordLabel: {
    paddingRight: theme.spacing.xxs,
    fontFamily: theme.font.primary.italic,
    fontSize: 14,
    color: theme.color.border,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
}));
