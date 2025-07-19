import { Canvas, FilterMode, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { CATEGORY_ICONS, type Item, RARITY_BACK_FRAMES, RARITY_FRONT_FRAMES } from '@/types/item';

const imagePath = (friendlyId: string) =>
  `https://res.cloudinary.com/dicl8zovu/image/upload/v1752789274/${friendlyId}.png`;

type Props = {
  item: Pick<Item, 'friendlyId' | 'category' | 'rarity'>;
};

export const ItemImage = ({ item }: Readonly<Props>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const image = useImage(imagePath(item.friendlyId));

  const filter = image && image.width() > 256 ? FilterMode.Linear : FilterMode.Nearest;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={styles.image}>
      <Image source={RARITY_BACK_FRAMES[item.rarity]} style={styles.layer} />
      <Canvas onLayout={onLayout} style={styles.layer}>
        <SkiaImage height={size.height} image={image} sampling={{ filter }} width={size.width} x={0} y={0} />
      </Canvas>
      <Image source={RARITY_FRONT_FRAMES[item.rarity]} style={styles.layer} />
      <Image source={CATEGORY_ICONS[item.category]} style={styles.categoryIcon} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryIcon: {
    position: 'absolute',
    top: theme.spacing.xxs,
    left: theme.spacing.xxs,
    width: 18,
    height: 18,
  },
}));
