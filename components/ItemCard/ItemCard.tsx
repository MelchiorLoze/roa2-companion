import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    <Pressable disabled={isLoading} onPress={handlePurchase} style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>{item.category}</Text>
        {item.coinPrice && (
          <View style={styles.priceContainer}>
            <Image
              contentFit="contain"
              source={require('@/assets/images/coins.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={styles.infoText}>{item.coinPrice}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E0B2A',
    borderColor: 'lightblue',
    borderWidth: 2,
    flex: 1 / 2,
    gap: 16,
    justifyContent: 'space-between',
    padding: 8,
  },
  title: {
    color: 'white',
    fontFamily: 'AgencyFB-Bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    color: 'white',
    fontFamily: 'AgencyFB-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
