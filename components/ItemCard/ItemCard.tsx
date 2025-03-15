import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { CoinsIcon, CommonIcon, EpicIcon, LegendaryIcon, RareIcon } from '@/assets/images';
import { Item, Rarity } from '@/types/store';

const rarityIcons = {
  [Rarity.COMMON]: CommonIcon,
  [Rarity.RARE]: RareIcon,
  [Rarity.EPIC]: EpicIcon,
  [Rarity.LEGENDARY]: LegendaryIcon,
};

type Props = { item: Item; onPress: () => void };

export const ItemCard = ({ item, onPress }: Props) => {
  styles.useVariants({
    textColor: item.rarity,
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Image contentFit="contain" source={rarityIcons[item.rarity]} style={styles.rarityIcon} />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        {item.coinPrice && (
          <View style={styles.priceContainer}>
            <Image contentFit="contain" source={CoinsIcon} style={styles.currencyIcon} />
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    flex: 1,
  },
  rarityIcon: {
    width: 16,
    height: 16,
    marginTop: theme.spacing.xs,
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
  priceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  currencyIcon: {
    width: 16,
    height: 16,
  },
  price: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    textTransform: 'uppercase',
  },
}));
