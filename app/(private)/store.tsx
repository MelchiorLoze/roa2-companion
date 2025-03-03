import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Countdown, ItemList } from '@/components';
import { useCoinStoreRotation } from '@/hooks/business';

export default function Store() {
  const { coinStoreRotation, isLoading } = useCoinStoreRotation();

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.spinner} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Next rotation in <Countdown date={coinStoreRotation?.expirationDate} />
      </Text>
      <ItemList items={coinStoreRotation.items} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontWeight: 'bold',
  },
});
