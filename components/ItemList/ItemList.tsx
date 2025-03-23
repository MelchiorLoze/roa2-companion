import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Item } from '@/types/store';

import { ItemCard } from '../ItemCard/ItemCard';

const keyExtractor = (item: Item) => item.id;

type Props = { items: Item[]; onSelect: (item: Item) => void };

export const ItemList = ({ items, onSelect }: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: Item }) => <ItemCard item={item} onPress={() => onSelect(item)} />,
    [onSelect],
  );

  return (
    <FlatList
      columnWrapperStyle={styles.container}
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={keyExtractor}
      numColumns={2}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.l,
  },
}));
