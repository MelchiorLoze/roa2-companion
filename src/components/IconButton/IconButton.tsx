import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export const IconButton = ({ iconName, size, style, onPress }: Props) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button" style={[styles.container, style]}>
      <MaterialIcons color={theme.color.white} name={iconName} size={size} />
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
