import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useAuth } from '@/contexts/AuthContext/AuthContext';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const { login, isLoggedIn, isLoading, isError } = useAuth();

  if (isLoading) return <ActivityIndicator size="large" style={styles.container} />;

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
    <View style={styles.container}>
      <Text style={styles.title}>Login with your ingame account</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        onChangeText={setEmail}
        placeholder="EMAIL"
        placeholderTextColor="#676767"
        style={styles.input}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="current-password"
        onChangeText={setPassword}
        placeholder="PASSWORD"
        placeholderTextColor="#676767"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      {(isError || isInvalid) && <Text style={styles.errorMessage}>Invalid email or password</Text>}
      <Button onPress={onSubmit} title="Login" />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.l,
    padding: theme.spacing.xl,
    backgroundColor: theme.color.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.font.primary.italic,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: theme.color.white,
  },
  input: {
    width: '100%',
    height: 40,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.color.accent,
    color: theme.color.white,
    backgroundColor: theme.color.dark,
  },
  errorMessage: {
    color: theme.color.error,
    fontSize: 12,
  },
}));
