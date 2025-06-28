import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type Item } from '@/types/item';

import { ItemCard } from '../ItemCard/ItemCard';

const keyExtractor = (item: Item) => item.id;

type Props = { items: Item[]; onSelect: (item: Item) => void };

export const ItemList = ({ items, onSelect }: Props) => {
  const renderItem = useCallback<ListRenderItem<Item>>(
    ({ item }) => <ItemCard item={item} onPress={() => onSelect(item)} />,
    [onSelect],
  );

  return (
    <FlatList
      columnWrapperStyle={styles.lineContainer}
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={keyExtractor}
      numColumns={2}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  lineContainer: {
    gap: theme.spacing.l,
  },
}));
