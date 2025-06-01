import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { CoinsIcon } from '@/assets/images';
import { OutlinedText } from '@/components';

import { CATEGORY_LABELS, type Item } from '../../types/item';
import { type Rarity, RARITY_ICONS } from '../../types/rarity';

type Props = { item: Item; onPress: () => void };

export const ItemCard = ({ item, onPress }: Props) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button" style={styles.container}>
      {({ pressed }) => (
        <LinearGradient colors={theme.color.borderGradient(pressed)} style={styles.borderGradient}>
          <LinearGradient colors={theme.color.cardGradient(pressed)} style={styles.gradient}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, pressed && styles.textPressed]}>{item.title}</Text>
              <Image contentFit="contain" source={RARITY_ICONS[item.rarity]} style={styles.rarityIcon} />
            </View>
            <View style={styles.info}>
              <OutlinedText
                color={styles.category(item.rarity).color}
                strokeWidth={2}
                text={CATEGORY_LABELS[item.category]}
              />
              {item.coinPrice && (
                <View style={styles.priceContainer}>
                  <Image contentFit="contain" source={CoinsIcon} style={styles.currencyIcon} />
                  <Text style={[styles.price, pressed && styles.textPressed]}>{item.coinPrice}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </LinearGradient>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1 / 2,
  },
  borderGradient: {
    flex: 1,
    padding: theme.spacing.xxs,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.s,
    gap: theme.spacing.l,
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
  category: (rarity: Rarity) => ({
    color: theme.color[rarity],
  }),
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  currencyIcon: {
    width: 20,
    height: 20,
  },
  price: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  textPressed: {
    color: theme.color.black,
  },
}));
