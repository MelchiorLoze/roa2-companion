import {
  Canvas,
  type DataSourceParam,
  FilterMode,
  Group,
  Image,
  type SkImage,
  type SkRect,
  useImage,
} from '@shopify/react-native-skia';
import { type ImageSource } from 'expo-image';
import { memo, useMemo, useState } from 'react';
import { type LayoutChangeEvent, type StyleProp, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Percentage = `${number}%`;

type Insets = {
  top: Percentage;
  right: Percentage;
  bottom: Percentage;
  left: Percentage;
};

type Slice = {
  source: SkRect;
  destination: SkRect;
};

type Props = {
  source: ImageSource;
  insets: Partial<Insets>;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_INSETS: Insets = { top: '0%', right: '0%', bottom: '0%', left: '0%' };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toPixels = (value: Percentage, fullSize: number) => {
  const parsed = Number.parseFloat(value.replace('%', ''));
  if (!Number.isFinite(parsed)) return 0;

  return (fullSize * parsed) / 100;
};

const normalizeInsets = (insets: Insets, width: number, height: number) => {
  const leftRaw = clamp(toPixels(insets.left, width), 0, width);
  const rightRaw = clamp(toPixels(insets.right, width), 0, width);
  const topRaw = clamp(toPixels(insets.top, height), 0, height);
  const bottomRaw = clamp(toPixels(insets.bottom, height), 0, height);

  const horizontalScale = leftRaw + rightRaw > width && leftRaw + rightRaw > 0 ? width / (leftRaw + rightRaw) : 1;
  const verticalScale = topRaw + bottomRaw > height && topRaw + bottomRaw > 0 ? height / (topRaw + bottomRaw) : 1;

  return {
    left: leftRaw * horizontalScale,
    right: rightRaw * horizontalScale,
    top: topRaw * verticalScale,
    bottom: bottomRaw * verticalScale,
  } as const;
};

// Destination corners scale proportionally to min(destWidth, destHeight) so they never
// appear oversized when the destination is smaller than the source image.
const computeDestinationInsets = (
  sourceInsets: { top: number; right: number; bottom: number; left: number },
  imageWidth: number,
  imageHeight: number,
  destinationWidth: number,
  destinationHeight: number,
) => {
  const minDest = Math.min(destinationWidth, destinationHeight);

  const leftRaw = clamp(imageWidth > 0 ? (sourceInsets.left / imageWidth) * minDest : 0, 0, sourceInsets.left);
  const rightRaw = clamp(imageWidth > 0 ? (sourceInsets.right / imageWidth) * minDest : 0, 0, sourceInsets.right);
  const topRaw = clamp(imageHeight > 0 ? (sourceInsets.top / imageHeight) * minDest : 0, 0, sourceInsets.top);
  const bottomRaw = clamp(imageHeight > 0 ? (sourceInsets.bottom / imageHeight) * minDest : 0, 0, sourceInsets.bottom);

  const horizontalScale =
    leftRaw + rightRaw > destinationWidth && leftRaw + rightRaw > 0 ? destinationWidth / (leftRaw + rightRaw) : 1;
  const verticalScale =
    topRaw + bottomRaw > destinationHeight && topRaw + bottomRaw > 0 ? destinationHeight / (topRaw + bottomRaw) : 1;

  return {
    left: leftRaw * horizontalScale,
    right: rightRaw * horizontalScale,
    top: topRaw * verticalScale,
    bottom: bottomRaw * verticalScale,
  } as const;
};

const distributeEdgeSpace = (targetSize: number, startEdge: number, endEdge: number) => {
  if (targetSize >= startEdge + endEdge)
    return { start: startEdge, end: endEdge, middle: targetSize - startEdge - endEdge } as const;

  const ratio = startEdge + endEdge > 0 ? targetSize / (startEdge + endEdge) : 0;

  return { start: startEdge * ratio, end: endEdge * ratio, middle: 0 } as const;
};

const createNineSlices = (image: SkImage, destinationWidth: number, destinationHeight: number, insets: Insets) => {
  const imageWidth = image.width();
  const imageHeight = image.height();

  const sourceInsets = normalizeInsets(insets, imageWidth, imageHeight);
  const destinationInsets = computeDestinationInsets(
    sourceInsets,
    imageWidth,
    imageHeight,
    destinationWidth,
    destinationHeight,
  );
  const widthSlices = distributeEdgeSpace(destinationWidth, destinationInsets.left, destinationInsets.right);
  const heightSlices = distributeEdgeSpace(destinationHeight, destinationInsets.top, destinationInsets.bottom);

  const sourceX = [0, sourceInsets.left, imageWidth - sourceInsets.right, imageWidth];
  const sourceY = [0, sourceInsets.top, imageHeight - sourceInsets.bottom, imageHeight];
  const destinationX = [0, widthSlices.start, widthSlices.start + widthSlices.middle, destinationWidth];
  const destinationY = [0, heightSlices.start, heightSlices.start + heightSlices.middle, destinationHeight];

  const slices: Slice[] = [];

  for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < 3; columnIndex += 1) {
      const source = {
        x: sourceX[columnIndex],
        y: sourceY[rowIndex],
        width: sourceX[columnIndex + 1] - sourceX[columnIndex],
        height: sourceY[rowIndex + 1] - sourceY[rowIndex],
      };

      const destination = {
        x: destinationX[columnIndex],
        y: destinationY[rowIndex],
        width: destinationX[columnIndex + 1] - destinationX[columnIndex],
        height: destinationY[rowIndex + 1] - destinationY[rowIndex],
      };

      if (source.width <= 0 || source.height <= 0 || destination.width <= 0 || destination.height <= 0) {
        continue;
      }

      slices.push({ source, destination });
    }
  }

  return { slices, imageWidth, imageHeight } as const;
};

export const NineSlicesImage = memo(({ source, insets, style }: Readonly<Props>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const image = useImage(source as DataSourceParam);

  const geometry = useMemo(() => {
    if (!image || size.width <= 0 || size.height <= 0) {
      return null;
    }

    return createNineSlices(image, size.width, size.height, { ...DEFAULT_INSETS, ...insets });
  }, [image, insets, size.height, size.width]);

  const onLayout = (event: LayoutChangeEvent) => {
    const newSize = event.nativeEvent.layout;
    setSize((previousSize) => {
      if (previousSize.width === newSize.width && previousSize.height === newSize.height) return previousSize;

      return newSize;
    });
  };

  return (
    <View onLayout={onLayout} style={style ?? styles.container}>
      {geometry && (
        <Canvas style={styles.canvas}>
          {geometry.slices.map(({ source: sourceRect, destination: destinationRect }, index) => {
            const scaleX = destinationRect.width / sourceRect.width;
            const scaleY = destinationRect.height / sourceRect.height;

            return (
              <Group clip={destinationRect} key={index}>
                <Group
                  transform={[
                    { translateX: destinationRect.x - sourceRect.x * scaleX },
                    { translateY: destinationRect.y - sourceRect.y * scaleY },
                    { scaleX },
                    { scaleY },
                  ]}
                >
                  <Image
                    height={geometry.imageHeight}
                    image={image}
                    sampling={{ filter: FilterMode.Linear }}
                    width={geometry.imageWidth}
                    x={0}
                    y={0}
                  />
                </Group>
              </Group>
            );
          })}
        </Canvas>
      )}
    </View>
  );
});

NineSlicesImage.displayName = 'NineSlicesImage';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  canvas: StyleSheet.absoluteFillObject,
});
