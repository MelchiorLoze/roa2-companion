import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Item } from '@/types/store';

import { ItemCard } from '../ItemCard/ItemCard';

const keyExtractor = (item: Item) => item.id;

const renderItem = ({ item }: { item: Item }) => <ItemCard item={item} />;

type Props = { items: Item[] };

export const ItemList = ({ items }: Props) => {
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
