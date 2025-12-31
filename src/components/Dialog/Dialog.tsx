import { type PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useKeyboard } from '@/hooks/core/useKeyboard/useKeyboard';

import { Alert } from '../Alert/Alert';

type Props = PropsWithChildren & {
  alertText?: string;
  onClose: () => void;
};

export const Dialog = ({ alertText, onClose, children }: Readonly<Props>) => {
  const { isVisible: isKeyboardVisible } = useKeyboard();

  const onPressOutside = () => {
    // Do not call isKeyboardVisible in callback to avoid unnecessary re-renders
    if (Keyboard.isVisible()) Keyboard.dismiss();
    else onClose();
  };

  return (
    <View>
      <Modal animationType="fade" onRequestClose={onClose} statusBarTranslucent transparent>
        <KeyboardAvoidingView behavior="height" enabled={isKeyboardVisible} style={styles.container}>
          <Pressable onPress={onPressOutside} style={styles.overlay} testID="overlay" />
          <View style={styles.dialog} testID="dialog">
            {children}
            {alertText && <Alert style={styles.alert} text={alertText} />}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.color.translucentDark,
  },
  dialog: {
    width: '85%',
    padding: theme.spacing.l,
    gap: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.color.accent,
    backgroundColor: theme.color.background,
  },
  alert: {
    marginHorizontal: -theme.spacing.l,
    marginBottom: -theme.spacing.l,
  },
}));
