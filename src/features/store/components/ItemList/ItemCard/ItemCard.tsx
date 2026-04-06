import { Image, ImageBackground } from 'expo-image';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ItemBackground, ItemOutline } from '@/assets/images/ui';
import { FancyText } from '@/components/FancyText/FancyText';
import { FittedText } from '@/components/FittedText/FittedText';
import { NineSlicesImage } from '@/components/NineSlicesImage/NineSlicesImage';
import { ParallelogramView } from '@/components/ParallelogramView/ParallelogramView';
import { Currency, CURRENCY_ICONS } from '@/types/currency';
import { CATEGORY_LABELS, type Item } from '@/types/item';

import { ItemImage } from '../ItemImage/ItemImage';

type Props = { item: Item; onPress: () => void };

export const ItemCard = memo(({ item, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button" style={styles.container}>
      {({ pressed }) => (
        <>
          <NineSlicesImage
            insets={{ top: '40%', right: '40%', bottom: '40%', left: '40%' }}
            source={pressed ? undefined : ItemOutline}
            style={styles.outline(pressed)}
          />
          <View style={styles.contentContainer}>
            <ImageBackground
              contentFit="fill"
              imageStyle={styles.backgroundImage}
              source={pressed ? undefined : ItemBackground}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.imageContainer(pressed)}>
              <ItemImage item={item} />
              <ParallelogramView skewAmount={theme.spacing.s} style={styles.nameContainer(pressed)}>
                <FittedText adjustsFontSizeToFit numberOfLines={2} style={styles.name(pressed)}>
                  {item.name}
                </FittedText>
              </ParallelogramView>
            </View>

            <>
              <FancyText
                style={{
                  ...styles.category(pressed),
                  gradient: { ...theme.color.gradient.labelText(pressed), direction: 'vertical' },
                }}
                text={CATEGORY_LABELS[item.category].toUpperCase()}
              />

              {item.coinPrice && (
                <View style={styles.priceContainer(pressed)}>
                  <Image contentFit="contain" source={CURRENCY_ICONS[Currency.COINS]} style={styles.currencyIcon} />
                  <FancyText
                    style={{
                      ...styles.price(pressed),
                      gradient: { ...theme.color.gradient.labelText(pressed, true), direction: 'vertical' },
                    }}
                    text={item.coinPrice.toString()}
                  />
                </View>
              )}
            </>
          </View>
        </>
      )}
    </Pressable>
  );
});

ItemCard.displayName = 'ItemCard';

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1 / 2,
    borderRadius: 14,
    overflow: 'hidden',
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
  outline: (pressed: boolean) => ({
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: pressed ? theme.color.itemSelectedPrimary : theme.color.transparent,
  }),
  contentContainer: {
    flex: 1,
    margin: 5,
    marginBottom: theme.spacing.s,
    padding: 10,
    paddingBottom: theme.spacing.xxs,
    gap: theme.spacing.xxl,
  },
  backgroundImage: {
    borderRadius: theme.spacing.m,
    backgroundColor: theme.color.white,
  },
  imageContainer: (pressed: boolean) => ({
    padding: 5,
    borderRadius: theme.spacing.s,
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
    fontFamily: theme.font.secondary.bold,
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
    fontFamily: theme.font.secondary.bold,
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
    borderTopLeftRadius: theme.spacing.s,
    borderBottomRightRadius: theme.spacing.s,
  }),
  currencyIcon: {
    width: 18,
    height: 18,
  },
  price: (pressed: boolean) => ({
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    strokeWidth: 1,
    strokeColor: pressed ? theme.color.transparent : theme.color.borderPrimary,
  }),
}));
