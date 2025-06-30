import { type PropsWithChildren } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Alert } from '../Alert/Alert';

type Props = PropsWithChildren & {
  alertText?: string;
  onClose: () => void;
};

export const Dialog = ({ alertText, onClose, children }: Props) => (
  <View>
    <Modal animationType="fade" onRequestClose={onClose} statusBarTranslucent transparent>
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.overlay} testID="overlay" />
        <View style={styles.dialog} testID="dialog">
          {children}
          {alertText && <Alert style={styles.alert} text={alertText} />}
        </View>
      </View>
    </Modal>
  </View>
);

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
    backgroundColor: theme.color.dark + 'AA',
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
