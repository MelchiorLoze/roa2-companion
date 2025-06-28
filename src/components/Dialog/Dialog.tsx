import { type PropsWithChildren } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Props = PropsWithChildren & {
  onClose: () => void;
};

export const Dialog = ({ onClose, children }: Props) => (
  <Modal onRequestClose={onClose} statusBarTranslucent transparent>
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.overlay} testID="overlay" />
      <View style={styles.dialog} testID="dialog">
        {children}
      </View>
    </View>
  </Modal>
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
    padding: theme.spacing.l,
    margin: theme.spacing.xl,
    gap: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.color.accent,
    backgroundColor: theme.color.background,
  },
}));
