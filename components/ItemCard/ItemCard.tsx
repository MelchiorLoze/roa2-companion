import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { usePurchaseInventoryItems } from '@/hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { CurrencyId, Item } from '@/types/store';

type Props = { item: Item };

export const ItemCard = ({ item }: Props) => {
  const { purchase, isLoading } = usePurchaseInventoryItems();

  const handlePurchase = () => {
    if (!item.coinPrice || !purchase) return;
    purchase({
      id: item.id,
      price: { value: item.coinPrice, currencyId: CurrencyId.COINS },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.category}>{item.category.toUpperCase()}</Text>
      <Text style={styles.title}>{item.title}</Text>
      {purchase && item.coinPrice && (
        <Button disabled={isLoading} onPress={handlePurchase} title={item.coinPrice.toString()} />
      )}
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
    justifyContent: 'space-between',
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
    fontSize: 12,
  },
});
