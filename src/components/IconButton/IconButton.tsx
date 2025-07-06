import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress: () => void;
};

export const IconButton = ({ iconName, size, style, disabled, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable disabled={disabled} onPress={onPress} role="button" style={[styles.container, style]}>
      <MaterialIcons color={disabled ? theme.color.disabled : theme.color.white} name={iconName} size={size} />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.transparent,
  },
}));
