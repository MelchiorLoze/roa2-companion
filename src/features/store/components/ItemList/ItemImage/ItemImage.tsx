import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
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
    <View style={styles.container}>
      <Image source={RARITY_BACK_FRAMES[item.rarity]} style={StyleSheet.absoluteFill} />
      <Canvas ref={canvasRef} style={StyleSheet.absoluteFill}>
        <SkiaImage
          height={canvasSize.height}
          image={image}
          sampling={{ filter: canvasFilter }}
          width={canvasSize.width}
          x={0}
          y={0}
        />
      </Canvas>
      <Image source={RARITY_FRONT_FRAMES[item.rarity]} style={StyleSheet.absoluteFill} />
      <Image source={CATEGORY_ICONS[item.category]} style={styles.categoryIcon} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoryIcon: {
    position: 'absolute',
    top: theme.spacing.xxs,
    left: theme.spacing.xxs,
    width: 14,
    height: 14,
  },
}));
