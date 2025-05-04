import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, Input, ResetPasswordDialog, Spinner } from '@/components';
import { useAuth } from '@/hooks/business';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  const { login, isLoggedIn, isLoading, isError } = useAuth();
  const { theme } = useUnistyles();
  const router = useRouter();

  if (isLoading) return <Spinner />;

  if (isLoggedIn) return <Redirect href="/store" />;

  const onForgotPassword = () => {
    setShowResetPasswordDialog(true);
    setIsInvalid(false);
  };

  const onCloseResetPasswordDialog = (email?: string) => {
    setShowResetPasswordDialog(false);
    if (email) {
      setEmail(email);
      setPassword('');
    }
  };

  const onSubmit = () => {
    if (!email?.length || !password?.length) {
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
          <Input autoComplete="email" onChange={setEmail} placeholder="EMAIL" value={email} />
          <Input
            autoComplete="current-password"
            contextualCTA={{
              label: 'Forgot your password?',
              onPress: onForgotPassword,
            }}
            errorMessage={isInvalid || isError ? 'Invalid email or password' : undefined}
            hidden
            onChange={setPassword}
            placeholder="PASSWORD"
            value={password}
          />
        </View>
        <Button label="Login" onPress={onSubmit} />
      </View>
      {showResetPasswordDialog && <ResetPasswordDialog email={email} onClose={onCloseResetPasswordDialog} />}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  aboutButton: {
    padding: theme.spacing.l,
    alignSelf: 'flex-end',
  },
  aboutButtonIcon: {
    fontSize: 32,
    marginRight: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
    backgroundColor: theme.color.background,
  },
  title: {
    width: '100%',
    fontFamily: theme.font.primary.italic,
    fontSize: 24,
    color: theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  form: {
    width: '100%',
    gap: theme.spacing.l,
  },
}));
