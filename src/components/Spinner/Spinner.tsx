import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export const Spinner = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.color.white} size="large" testID="spinner" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
