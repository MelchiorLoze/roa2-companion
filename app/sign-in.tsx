import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
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
        <Text style={styles.title}>Login with your ingame account</Text>
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
        {(isError || isInvalid) && <Text style={styles.errorMessage}>Invalid email or password</Text>}
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
    gap: theme.spacing.l,
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
  title: {
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
  errorMessage: {
    fontSize: 14,
    color: theme.color.error,
  },
}));
