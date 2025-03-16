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
    flex: 1 / 2,
    justifyContent: 'space-between',
    padding: theme.spacing.s,
    gap: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.color.border,
    backgroundColor: theme.color.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  rarityIcon: {
    width: 16,
    height: 16,
    marginTop: theme.spacing.xxs,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    variants: {
      textColor: {
        common: { color: theme.color.common },
        rare: { color: theme.color.rare },
        epic: { color: theme.color.epic },
        legendary: { color: theme.color.legendary },
        default: { color: theme.color.white },
      },
    },
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  currencyIcon: {
    width: 16,
    height: 16,
  },
  price: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
