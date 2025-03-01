import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Item } from '@/types/store';

type Props = { item: Item };

export const ItemCard = ({ item }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{item.category.toUpperCase()}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.coinPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    gap: 8,
  },
  category: {
    fontSize: 8,
    color: 'white',
    alignSelf: 'flex-start',
    backgroundColor: 'black',
    padding: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  price: {
    color: 'orange',
    alignSelf: 'flex-end',
  },
});
