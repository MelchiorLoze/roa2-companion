import { Image } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Card } from '@/components/Card/Card';
import { FancyText } from '@/components/FancyText/FancyText';
import { FittedText } from '@/components/FittedText/FittedText';
import { ParallelogramView } from '@/components/ParallelogramView/ParallelogramView';
import { Currency, CURRENCY_ICONS } from '@/types/currency';
import { CATEGORY_LABELS, type Item } from '@/types/item';

import { ItemImage } from '../ItemImage/ItemImage';

type Props = { item: Item; onPress: () => void };

export const ItemCard = ({ item, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Card contentStyle={styles.content} onPress={onPress} role="button" style={styles.container}>
      {(pressed) => (
        <>
          <View style={styles.imageContainer(pressed)}>
            <ItemImage item={item} />
            <ParallelogramView skewAmount={theme.spacing.s} style={styles.nameContainer(pressed)}>
              <FittedText adjustsFontSizeToFit numberOfLines={2} style={styles.name(pressed)}>
                {item.name}
              </FittedText>
            </ParallelogramView>
          </View>

          <FancyText
            gradient={{ ...theme.color.gradient.labelText(pressed), direction: 'vertical' }}
            style={styles.category(pressed)}
            text={CATEGORY_LABELS[item.category]}
          />

          {item.coinPrice && (
            <View style={styles.priceContainer(pressed)}>
              <Image contentFit="contain" source={CURRENCY_ICONS[Currency.COINS]} style={styles.currencyIcon} />
              <FancyText
                gradient={{ ...theme.color.gradient.labelText(pressed, true), direction: 'vertical' }}
                style={styles.price(pressed)}
                text={item.coinPrice.toString()}
              />
            </View>
          )}
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1 / 2,
  },
  content: {
    padding: 10,
    paddingBottom: theme.spacing.xxs,
    gap: theme.spacing.xxl,
  },
  imageContainer: (pressed: boolean) => ({
    padding: 5,
    borderRadius: 8,
    backgroundColor: pressed ? theme.color.itemSelectedSecondary : theme.color.itemImageBackground,
  }),
  nameContainer: (pressed: boolean) => ({
    position: 'absolute',
    bottom: 0,
    transform: [{ translateY: '30%' }],
    maxWidth: '95%',
    minWidth: '60%',
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.xs + theme.spacing.s, // compensate for skew
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: pressed ? theme.color.itemSelectedPrimary : theme.color.itemNameBackground,
  }),
  name: (pressed: boolean) => ({
    fontFamily: theme.font.primary.bold,
    fontSize: 14,
    color: pressed ? theme.color.black : theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: theme.color.itemNameShadow,
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 0.001, // 0 radius is not supported
  }),
  category: (pressed: boolean) => ({
    fontSize: 14,
    fontFamily: theme.font.primary.bold,
    textTransform: 'uppercase',
    strokeWidth: 1,
    strokeColor: pressed ? theme.color.transparent : theme.color.black,
  }),
  priceContainer: (pressed: boolean) => ({
    position: 'absolute',
    right: -0.6, // compensate border not being present on the right and bottom sides
    bottom: -0.6,
    overflow: 'hidden',
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: pressed ? theme.color.itemSelectedPrimary : theme.color.itemPriceBackground,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: pressed ? theme.color.itemSelectedPrimary : theme.color.itemPriceBorder,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  }),
  currencyIcon: {
    width: 20,
    aspectRatio: 1,
  },
  price: (pressed: boolean) => ({
    fontFamily: theme.font.primary.bold,
    fontSize: 14,
    strokeWidth: 1,
    strokeColor: pressed ? theme.color.transparent : theme.color.labelOutline,
  }),
}));
