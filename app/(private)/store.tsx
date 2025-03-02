import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ItemList } from '@/components/ItemList/ItemList';
import { useGetMyRotationalCoinStore, useSearchItems } from '@/hooks/data';

export default function Store() {
  const { rotationalCoinStore, isLoading: isRotationalCoinStoreLoading } = useGetMyRotationalCoinStore();
  const { items, isLoading: isSearchItemsLoading } = useSearchItems(rotationalCoinStore?.itemIds ?? []);

  if (isRotationalCoinStoreLoading || isSearchItemsLoading) {
    return <ActivityIndicator size="large" style={styles.spinner} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is your daily rotation</Text>
      <ItemList items={items} />
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
    fontSize: 24,
    fontWeight: 'bold',
  },
});
