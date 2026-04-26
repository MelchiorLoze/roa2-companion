import { ImageBackground } from 'expo-image';
import { type PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { DialogBackground } from '@/assets/images/ui';
import { useKeyboard } from '@/hooks/core/useKeyboard/useKeyboard';

import { Alert } from '../Alert/Alert';

type Props = PropsWithChildren<{
  alertText?: string;
  onClose: () => void;
}>;

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
            <View style={styles.innerContainer}>
              <ImageBackground contentFit="fill" source={DialogBackground} style={StyleSheet.absoluteFillObject} />
              {children}
              {alertText && <Alert style={styles.alert} text={alertText} />}
            </View>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.color.overlay,
  },
  dialog: {
    width: '85%',
    borderWidth: 2.5,
    borderColor: theme.color.dialogBorderPrimary,
    backgroundColor: theme.color.dialogBorderSecondary,
  },
  innerContainer: {
    borderWidth: 2,
    borderColor: theme.color.dialogBorderSecondary,
    minHeight: '20%',
    alignItems: 'center',
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  alert: {
    marginHorizontal: -theme.spacing.l,
    marginBottom: -theme.spacing.l,
  },
}));
