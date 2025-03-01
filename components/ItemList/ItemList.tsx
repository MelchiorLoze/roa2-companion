import { FlatList, StyleSheet } from 'react-native';

import { Item } from '@/types/store';
import { ItemCard } from '../ItemCard/ItemCard';

const keyExtractor = (item: Item) => item.id;

type Props = { items: Item[] };

export const ItemList = ({ items }: Props) => {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={keyExtractor}
      renderItem={ItemCard}
      numColumns={2}
      columnWrapperStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
