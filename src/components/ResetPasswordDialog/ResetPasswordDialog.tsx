import { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useSendAccountRecoveryEmail } from '@/hooks/data';

import { Button } from '../Button/Button';
import { Dialog } from '../Dialog/Dialog';
import { Input } from '../Input/Input';
import { Spinner } from '../Spinner/Spinner';

type Props = {
  email?: string;
  onClose: (email?: string) => void;
};

const Content = ({ email: propsEmail, onClose }: Props) => {
  const [email, setEmail] = useState(propsEmail ?? '');
  const [isInvalid, setIsInvalid] = useState(false);

  const { sendRecoveryEmail, isLoading, isSuccess, isError } = useSendAccountRecoveryEmail();

  const onSubmit = () => {
    if (!email?.length) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);
    sendRecoveryEmail(email);
  };

  if (isLoading) return <Spinner />;

  if (isSuccess) {
    return (
      <>
        <Text style={styles.description}>
          Check your inbox, an email sent to {email} to reset your password!{'\n'}
          (you may have to wait a couple of minutes until you receive it)
        </Text>
        <Button label="Ok" onPress={() => onClose(email)} />
      </>
    );
  }

  return (
    <>
      <Text style={styles.description}>
        After submitting, you will receive an email from Aether Studios allowing you to reset your password
      </Text>
      <Input
        autoComplete="email"
        errorMessage={isInvalid || isError ? 'Please provide a valid email' : undefined}
        onChange={setEmail}
        placeholder="EMAIL"
        value={email}
      />
      <Button label="Reset password" onPress={onSubmit} />
    </>
  );
};

export const ResetPasswordDialog = ({ email, onClose }: Props) => {
  return (
    <Dialog onClose={onClose}>
      <Content email={email} onClose={onClose} />
    </Dialog>
  );
};

const styles = StyleSheet.create((theme) => ({
  description: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
  },
}));
