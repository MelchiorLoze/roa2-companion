import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useCachedSkiaImage } from '@/hooks/business/useCachedSkiaImage/useCachedSkiaImage';
import { CATEGORY_ICONS, type Item, RARITY_BACK_FRAMES, RARITY_FRONT_FRAMES } from '@/types/item';

type Props = {
  item: Pick<Item, 'imageUrl' | 'category' | 'rarity'>;
};

export const ItemImage = ({ item }: Readonly<Props>) => {
  const { image, canvasRef, canvasSize, canvasFilter } = useCachedSkiaImage(item.imageUrl);

  return (
    <View style={styles.image}>
      <Image source={RARITY_BACK_FRAMES[item.rarity]} style={styles.layer} />
      <Canvas ref={canvasRef} style={styles.layer}>
        <SkiaImage
          height={canvasSize.height}
          image={image}
          sampling={{ filter: canvasFilter }}
          width={canvasSize.width}
          x={0}
          y={0}
        />
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
