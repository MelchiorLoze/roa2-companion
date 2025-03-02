import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Countdown, ItemList } from '@/components';
import { useGetMyRotationalCoinStore, useSearchItems } from '@/hooks/data';

export default function Store() {
  const { rotationalCoinStore, isLoading: isRotationalCoinStoreLoading } = useGetMyRotationalCoinStore();
  const { items, isLoading: isSearchItemsLoading } = useSearchItems(rotationalCoinStore?.itemIds ?? []);

  if (isRotationalCoinStoreLoading || isSearchItemsLoading) {
    return <ActivityIndicator size="large" style={styles.spinner} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Next rotation in <Countdown date={rotationalCoinStore?.expirationDate} />
      </Text>
      <ItemList items={items.sort((itemA, itemB) => (itemA.coinPrice ?? 0) - (itemB.coinPrice ?? 0))} />
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
