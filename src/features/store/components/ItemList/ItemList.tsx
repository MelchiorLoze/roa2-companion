import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type Item } from '@/types/item';

import { ItemCard } from './ItemCard/ItemCard';

const keyExtractor = (item: Item): string => item.id;

type Props = { items: Item[]; onSelect: (item: Item) => void };

export const ItemList = ({ items, onSelect }: Readonly<Props>) => {
  const renderItem = useCallback<ListRenderItem<Item>>(
    ({ item }) => <ItemCard item={item} onPress={() => onSelect(item)} />,
    [onSelect],
  );

  return (
    <FlatList
      columnWrapperStyle={styles.rowWrapper}
      contentContainerStyle={styles.subContainer}
      data={items}
      keyExtractor={keyExtractor}
      numColumns={2}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    marginHorizontal: -theme.spacing.s,
  },
  subContainer: {
    gap: theme.spacing.l,
    padding: theme.spacing.s,
    paddingBottom: theme.spacing.l,
  },
  rowWrapper: {
    gap: theme.spacing.l,
  },
}));
