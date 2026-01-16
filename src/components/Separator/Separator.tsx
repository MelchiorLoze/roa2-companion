import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Variant = 'borderLight' | 'accent' | 'gradient';

type Props = {
  variant?: Variant;
  pressed?: boolean;
  height?: number;
};

export const Separator = ({ variant = 'borderLight', pressed = false, height = 1 }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  if (variant === 'gradient') {
    return (
      <LinearGradient
        {...theme.color.gradient.properties({ direction: 'horizontal' })}
        colors={theme.color.borderGradient(pressed)}
        style={styles.separator(variant, height)}
      />
    );
  }
  return <View style={styles.separator(variant, height)} />;
};

const styles = StyleSheet.create((theme) => ({
  separator: (variant: Variant, height: number) => ({
    height,
    backgroundColor: variant !== 'gradient' ? theme.color[variant] : 'transparent',
  }),
}));
