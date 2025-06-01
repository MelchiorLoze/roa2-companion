import type { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Props = PropsWithChildren & {
  onClose: () => void;
};

export const Dialog = ({ onClose, children }: Props) => (
  <>
    <Pressable onPress={onClose} style={styles.overlay} testID="overlay" />
    <View style={styles.container} testID="dialog">
      {children}
    </View>
  </>
);

const styles = StyleSheet.create((theme) => ({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.color.dark + 'AA',
  },
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    width: '75%',
    padding: theme.spacing.l,
    gap: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.color.accent,
    backgroundColor: theme.color.background,
  },
}));
