import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type StyleProp, Text, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

export const Alert = ({ text, style }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient {...theme.gradient.vertical} colors={theme.color.alertGradient} style={[styles.container, style]}>
      <Ionicons name="alert-circle-sharp" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  icon: {
    fontSize: 30,
    color: theme.color.black,
  },
  text: {
    flexShrink: 1,
    fontFamily: theme.font.primary.regular,
    color: theme.color.black,
    fontSize: 14,
  },
}));
