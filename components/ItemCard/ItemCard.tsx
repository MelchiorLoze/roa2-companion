import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Item } from '@/types/store';

type Props = { item: Item; onPress: () => void };

export const ItemCard = ({ item, onPress }: Props) => {
  styles.useVariants({
    textColor: item.rarity,
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        {item.coinPrice && (
          <View style={styles.priceContainer}>
            <Image
              contentFit="contain"
              source={require('@/assets/images/coins.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={styles.price}>{item.coinPrice}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.color.background,
    borderColor: theme.color.border,
    borderWidth: 2,
    flex: 1 / 2,
    gap: theme.spacing.l,
    justifyContent: 'space-between',
    padding: theme.spacing.m,
  },
  title: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    variants: {
      textColor: {
        common: { color: theme.color.common },
        rare: { color: theme.color.rare },
        epic: { color: theme.color.epic },
        legendary: { color: theme.color.legendary },
        default: { color: theme.color.white },
      },
    },
  },
  price: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
}));
