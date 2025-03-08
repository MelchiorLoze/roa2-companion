import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Item } from '@/types/store';

import { ItemCard } from '../ItemCard/ItemCard';

const keyExtractor = (item: Item) => item.id;

type Props = { items: Item[]; onSelect: (item: Item) => void };

export const ItemList = ({ items, onSelect }: Props) => {
  return (
    <FlatList
      columnWrapperStyle={styles.container}
      contentContainerStyle={styles.container}
      data={items}
      keyExtractor={keyExtractor}
      numColumns={2}
      renderItem={({ item }: { item: Item }) => <ItemCard item={item} onPress={() => onSelect(item)} />}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.l,
  },
}));
