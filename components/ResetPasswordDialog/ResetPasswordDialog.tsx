import { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Input, Spinner } from '@/components';
import { Dialog } from '@/components/Dialog/Dialog';
import { useSendAccountRecoveryEmail } from '@/hooks/data';

type Props = {
  email?: string;
  onClose: (email?: string) => void;
};

const Content = ({ email: propsEmail, onClose }: Props) => {
  const [email, setEmail] = useState(propsEmail || '');
  const [isInvalid, setIsInvalid] = useState(false);

  const { sendRecoveryEmail, isLoading, isSuccess, isError } = useSendAccountRecoveryEmail();

  const onSubmit = () => {
    if (!email) {
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
      <Input autoComplete="email" onChange={setEmail} placeholder="EMAIL" value={email} />
      {(isInvalid || isError) && <Text style={styles.errorMessage}>Please provide a valid email</Text>}
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
  errorMessage: {
    fontFamily: theme.font.primary.regular,
    fontSize: 14,
    color: theme.color.error,
  },
  description: {
    fontFamily: theme.font.primary.regular,
    fontSize: 14,
    color: theme.color.white,
  },
}));
