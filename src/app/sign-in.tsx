import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/components/Button/Button';
import { Disclaimer } from '@/components/Disclaimer/Disclaimer';
import { Input } from '@/components/Input/Input';
import { Spinner } from '@/components/Spinner/Spinner';
import { ResetPasswordDialog } from '@/features/auth/components/ResetPasswordDialog/ResetPasswordDialog';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { useKeyboard } from '@/hooks/core/useKeyboard/useKeyboard';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  const { isVisible: isKeyboardVisible } = useKeyboard();

  const { login, isLoggedIn, isLoading, isError } = useAuth();

  if (isLoading) return <Spinner />;

  if (isLoggedIn) return <Redirect href="/store" />;

  const onForgotPassword = () => {
    // Do not call isKeyboardVisible in callback to avoid unnecessary re-renders
    if (Keyboard.isVisible()) Keyboard.dismiss();
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
      <KeyboardAvoidingView
        behavior="padding"
        enabled={isKeyboardVisible && !showResetPasswordDialog}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login to your{'\n'}in-game account</Text>
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

        <Disclaimer style={styles.disclaimer} />
      </KeyboardAvoidingView>
      {showResetPasswordDialog && <ResetPasswordDialog email={email} onClose={onCloseResetPasswordDialog} />}
    </>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    padding: theme.spacing.l,
    marginBottom: runtime.insets.bottom,
    justifyContent: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xl,
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
    gap: theme.spacing.m,
  },
  disclaimer: {
    position: 'absolute',
    bottom: theme.spacing.l,
    left: theme.spacing.l,
  },
}));
