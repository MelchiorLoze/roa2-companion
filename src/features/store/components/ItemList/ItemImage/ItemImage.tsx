import { Canvas, FilterMode, Image, useImage } from '@shopify/react-native-skia';
import React, { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const imagePath = (friendlyId: string) =>
  `https://res.cloudinary.com/dicl8zovu/image/upload/v1752789274/${friendlyId}.png`;

type Props = {
  friendlyId: string;
};

export const ItemImage = ({ friendlyId }: Readonly<Props>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const image = useImage(imagePath(friendlyId));

  const filter = image && image.width() > 256 ? FilterMode.Linear : FilterMode.Nearest;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <Canvas onLayout={onLayout} style={styles.image}>
      <Image height={size.height} image={image} sampling={{ filter }} width={size.width} x={0} y={0} />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});
