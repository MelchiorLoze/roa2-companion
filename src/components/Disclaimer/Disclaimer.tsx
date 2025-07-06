import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type StyleProp, Text, TouchableWithoutFeedback, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Disclaimer = ({ style }: Readonly<Props>) => {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => router.navigate('/about')} testID="disclaimer">
      <View style={[styles.container, style]}>
        <Ionicons name="information-circle-sharp" style={styles.icon} />
        <Text style={styles.body}>
          This project is a fan-made creation and is not affiliated with Aether Studios or Offbrand Games in any
          official capacity. The app works directly between your device and the official game servers, with no third
          parties involved in transferring or processing your data. <Text style={styles.learnMore}>Learn more...</Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  icon: {
    fontSize: 24,
    color: theme.color.silver,
  },
  body: {
    flexShrink: 1,
    fontFamily: theme.font.primary.italic,
    color: theme.color.silver,
    fontSize: 14,
  },
  learnMore: {
    color: theme.color.white,
    textDecorationLine: 'underline',
  },
}));
