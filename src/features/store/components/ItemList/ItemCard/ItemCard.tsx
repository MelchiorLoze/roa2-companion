import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { Currency, CURRENCY_ICONS } from '@/types/currency';
import { CATEGORY_LABELS, type Item, type Rarity } from '@/types/item';

import { ItemImage } from '../ItemImage/ItemImage';

type Props = { item: Item; onPress: () => void };

export const ItemCard = ({ item, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button" style={styles.container}>
      {({ pressed }) => (
        <LinearGradient colors={theme.color.borderGradient(pressed)} style={styles.borderGradient}>
          <LinearGradient colors={theme.color.cardGradient(pressed)} style={styles.gradient}>
            <ItemImage item={item} />

            <View style={styles.infoContainer}>
              <Text style={[styles.title, pressed && styles.textPressed]}>{item.name}</Text>

              <View style={styles.info}>
                <OutlinedText
                  style={styles.category(item.rarity)}
                  text={CATEGORY_LABELS[item.category].toUpperCase()}
                />
                {item.coinPrice && (
                  <View style={styles.priceContainer}>
                    <Image contentFit="contain" source={CURRENCY_ICONS[Currency.COINS]} style={styles.currencyIcon} />
                    <Text style={[styles.price, pressed && styles.textPressed]}>{item.coinPrice}</Text>
                  </View>
                )}
              </View>
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
    boxShadow: [
      {
        color: theme.color.black,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 5,
        spreadDistance: 0,
      },
    ],
  },
  borderGradient: {
    flex: 1,
    padding: theme.spacing.xxs,
  },
  gradient: {
    flex: 1,
    padding: theme.spacing.s,
    gap: theme.spacing.s,
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.l,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: (rarity: Rarity) => ({
    fontSize: 18,
    fontFamily: theme.font.secondary.bold,
    color: theme.color[rarity],
    strokeWidth: 2,
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
