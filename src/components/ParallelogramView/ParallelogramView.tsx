import { type ImageSource } from 'expo-image';
import { type PropsWithChildren, type ReactNode, useState } from 'react';
import {
  type ColorValue,
  type ImageSourcePropType,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { ClipPath, Defs, Image, LinearGradient, Path, Polygon, Stop, Svg } from 'react-native-svg';

import { getGradientProps, type GradientColors, type GradientWithDirection } from '@/utils/getGradientProps';

type Props<T extends GradientColors> = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  skewAmount: number;
}> &
  Either<{ gradient?: GradientWithDirection<T> }, { backgroundImage?: ImageSource }>;

type Point = [number, number];

// Positive skewAmount: top edge shifted right (leans like /)
// Negative skewAmount: top edge shifted left (leans like \)
const skewPolygonPoints = (
  skewAmount: number,
  borderWidth: number,
  size: { width: number; height: number },
): [Point, Point, Point, Point] => {
  const skew = Math.abs(skewAmount);
  return skewAmount >= 0
    ? [
        [skew, borderWidth],
        [size.width - borderWidth, borderWidth],
        [size.width - skew, size.height - borderWidth],
        [borderWidth, size.height - borderWidth],
      ]
    : [
        [borderWidth, borderWidth],
        [size.width - skew, borderWidth],
        [size.width, size.height - borderWidth],
        [skew, size.height - borderWidth],
      ];
};

const roundedPolygonPath = (points: Point[], radius: number): string => {
  const n = points.length;
  const parts: string[] = [];

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const dx1 = prev[0] - curr[0];
    const dy1 = prev[1] - curr[1];
    const len1 = Math.hypot(dx1, dy1);

    const dx2 = next[0] - curr[0];
    const dy2 = next[1] - curr[1];
    const len2 = Math.hypot(dx2, dy2);

    const r = Math.min(radius, len1 / 2, len2 / 2);

    const startX = curr[0] + (dx1 / len1) * r;
    const startY = curr[1] + (dy1 / len1) * r;
    const endX = curr[0] + (dx2 / len2) * r;
    const endY = curr[1] + (dy2 / len2) * r;

    parts.push(i === 0 ? `M${startX},${startY}` : `L${startX},${startY}`, `Q${curr[0]},${curr[1]} ${endX},${endY}`);
  }

  parts.push('Z');
  return parts.join(' ');
};

const formatPoints = (points: Point[]): string => {
  return points.map((p) => p.join(',')).join(' ');
};

export const ParallelogramView = <T extends GradientColors>({
  style,
  skewAmount,
  backgroundImage,
  gradient,
  children,
}: Readonly<Props<T>>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const {
    backgroundColor = 'transparent',
    borderColor,
    borderWidth = 0,
    borderRadius: rawBorderRadius = 0,
    ...viewStyle
  } = StyleSheet.flatten(style ?? {});
  const borderRadius = typeof rawBorderRadius === 'number' ? rawBorderRadius : 0;

  const points: Point[] = skewPolygonPoints(skewAmount, borderWidth, size);

  const gradientProps = gradient ? getGradientProps(gradient) : undefined;
  const fill = gradientProps ? 'url(#parallelogramGradient)' : backgroundImage ? 'transparent' : backgroundColor;

  const renderShape = (): ReactNode =>
    borderRadius > 0 ? (
      <Path
        d={roundedPolygonPath(points, borderRadius)}
        fill={fill}
        stroke={borderColor}
        strokeLinejoin="round"
        strokeWidth={borderWidth}
      />
    ) : (
      <Polygon fill={fill} points={formatPoints(points)} stroke={borderColor} strokeWidth={borderWidth} />
    );

  const renderSvg = (): ReactNode =>
    size.width > 0 && size.height > 0 ? (
      <Svg height={size.height} style={StyleSheet.absoluteFill} width={size.width}>
        {gradientProps && (
          <Defs>
            <LinearGradient
              id="parallelogramGradient"
              x1={`${gradientProps.start.x * 100}%`}
              x2={`${gradientProps.end.x * 100}%`}
              y1={`${gradientProps.start.y * 100}%`}
              y2={`${gradientProps.end.y * 100}%`}
            >
              {gradientProps.colors.map((color, index) => {
                const offset = gradientProps.locations?.[index] ?? index / (gradientProps.colors.length - 1);
                return <Stop key={offset} offset={`${offset * 100}%`} stopColor={color as ColorValue} />;
              })}
            </LinearGradient>
          </Defs>
        )}

        {backgroundImage && (
          <>
            <Defs>
              <ClipPath id="parallelogramClip">
                {borderRadius > 0 ? (
                  <Path d={roundedPolygonPath(points, borderRadius)} />
                ) : (
                  <Polygon points={formatPoints(points)} />
                )}
              </ClipPath>
            </Defs>
            <Image
              clipPath="url(#parallelogramClip)"
              height={size.height}
              href={backgroundImage as ImageSourcePropType}
              preserveAspectRatio="none"
              width={size.width}
            />
          </>
        )}

        {renderShape()}
      </Svg>
    ) : null;

  return (
    <View
      onLayout={(e) =>
        setSize({ width: Math.ceil(e.nativeEvent.layout.width), height: Math.ceil(e.nativeEvent.layout.height) })
      }
      style={viewStyle}
    >
      {renderSvg()}
      {children}
    </View>
  );
};
