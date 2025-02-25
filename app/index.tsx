import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggedIn } = useAuth();

  if (isLoggedIn) return <Redirect href="/store" />;

  const onSubmit = () => {
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text>Please login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" onChangeText={setPassword} />
      <Button title="Login" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
