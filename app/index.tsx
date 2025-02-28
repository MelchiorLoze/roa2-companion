import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext/AuthContext';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const { login, isLoggedIn, isLoading, isError } = useAuth();

  if (isLoading) return <ActivityIndicator style={styles.container} />;

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
      <Text style={styles.title}>Please login with your ingame account</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} />
      {(isError || isInvalid) && <Text style={styles.errorMessage}>Invalid email or password</Text>}
      <Button title="Login" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
});
