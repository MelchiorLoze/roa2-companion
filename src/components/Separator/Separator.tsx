import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Variant = 'border' | 'accent';

type Props = {
  variant?: Variant;
  height?: number;
};

export const Separator = ({ variant = 'border', height = 1 }: Readonly<Props>) => {
  return <View style={styles.separator(variant, height)} />;
};

const styles = StyleSheet.create((theme) => ({
  separator: (variant: Variant, height: number) => ({
    height,
    backgroundColor: theme.color[variant],
  }),
}));
