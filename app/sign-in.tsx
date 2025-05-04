import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
          <Input autoComplete="email" onChange={setEmail} placeholder="EMAIL" value={email} />
          <Input
            autoComplete="current-password"
            hidden
            onChange={setPassword}
            placeholder="PASSWORD"
            value={password}
          />
          <View style={styles.formFooter}>
            {(isInvalid || isError) && <Text style={styles.errorMessage}>Invalid email or password</Text>}
            <Pressable onPress={onForgotPassword} role="button" style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordButtonLabel}>Forgot your password?</Text>
            </Pressable>
          </View>
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
  forgotPasswordButton: {
    flex: 1,
    padding: theme.spacing.xs,
  },
  forgotPasswordButtonLabel: {
    fontFamily: theme.font.primary.italic,
    fontSize: 14,
    color: theme.color.border,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
}));
