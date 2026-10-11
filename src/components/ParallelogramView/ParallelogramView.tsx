import { type ImageSource } from 'expo-image';
import { type PropsWithChildren, type ReactNode, useId, useState } from 'react';
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
  // Lean of the slanted sides in degrees, measured from the vertical axis
  skewAmount: number;
}> &
  Either<{ gradient?: GradientWithDirection<T> }, { backgroundImage?: ImageSource }>;

type Point = [number, number];

const DEG_TO_RAD = Math.PI / 180;

// Positive skewAmount: top edge shifted right (leans like /)
// Negative skewAmount: top edge shifted left (leans like \)
// skewAmount is the lean ANGLE in degrees of the slanted sides (measured from the
// vertical axis). The horizontal offset scales with the view height, so shapes of
// any size share the same slope and nested layers (e.g. borders) stay parallel.
const skewOffset = (skewAmount: number, y: number, viewHeight: number): number => {
  const ratio = Math.abs(Math.tan(skewAmount * DEG_TO_RAD));
  return skewAmount >= 0 ? ratio * (viewHeight - y) : ratio * y;
};

const skewPolygonPoints = (
  skewAmount: number,
  borderWidth: number,
  size: { width: number; height: number },
): [Point, Point, Point, Point] => {
  const skew = Math.abs(Math.tan(skewAmount * DEG_TO_RAD)) * size.height;
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

// The parallelogram is a shear of an axis-aligned rectangle (skew is applied in
// screen space, so its corners are not perfect right angles). Rounding each
// sheared corner independently with the same radius produces inconsistent-looking
// rounding, because a shear maps circles to ellipses only when applied uniformly.
// Instead we round the rectangle BEFORE shearing and shear the whole path, so all
// four corners are congruent. Both functions map between the two spaces using the
// per-row offset given by `skewOffset`.
const skewedPointsToRect = (points: Point[], skewAmount: number, viewHeight: number): Point[] =>
  points.map(([x, y]) => [x - skewOffset(skewAmount, y, viewHeight), y]);

const rectPointsToSkewed = (points: Point[], skewAmount: number, viewHeight: number): Point[] =>
  points.map(([x, y]) => [x + skewOffset(skewAmount, y, viewHeight), y]);

const roundedParallelogramPath = (points: Point[], radius: number, skewAmount: number, viewHeight: number): string => {
  const rect = skewedPointsToRect(points, skewAmount, viewHeight);

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const [x, y] of rect) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const r = Math.max(0, Math.min(radius, (maxX - minX) / 2, (maxY - minY) / 2));

  // Rounded rectangle corner points and the corner vertices used as bezier control points
  const outline: Point[] = [
    [minX + r, minY],
    [maxX - r, minY],
    [maxX, minY + r],
    [maxX, maxY - r],
    [maxX - r, maxY],
    [minX + r, maxY],
    [minX, maxY - r],
    [minX, minY + r],
  ];
  const corners: Point[] = [
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
    [minX, minY],
  ];

  const skewed = rectPointsToSkewed(outline, skewAmount, viewHeight);
  const skewedCorners = rectPointsToSkewed(corners, skewAmount, viewHeight);
  const fmt = ([x, y]: Point) => `${x},${y}`;

  let d = `M${fmt(skewed[0])} L${fmt(skewed[1])}`;
  for (let i = 0; i < 4; i++) {
    d += ` Q${fmt(skewedCorners[i])} ${fmt(skewed[(2 * i + 2) % 8])}`;
    if (i < 3) d += ` L${fmt(skewed[(2 * i + 3) % 8])}`;
  }
  return `${d} Z`;
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

  // Unique per instance so mounted siblings don't collide on the same SVG def ids
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradientId = `parallelogramGradient-${uid}`;
  const clipId = `parallelogramClip-${uid}`;

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
  const fill = gradientProps ? `url(#${gradientId})` : backgroundImage ? 'transparent' : backgroundColor;

  const shapePath =
    borderRadius > 0 && size.height > 0
      ? roundedParallelogramPath(points, borderRadius, skewAmount, size.height)
      : undefined;

  const renderShape = (): ReactNode =>
    shapePath ? (
      <Path d={shapePath} fill={fill} stroke={borderColor} strokeLinejoin="round" strokeWidth={borderWidth} />
    ) : (
      <Polygon fill={fill} points={formatPoints(points)} stroke={borderColor} strokeWidth={borderWidth} />
    );

  const renderSvg = (): ReactNode =>
    size.width > 0 && size.height > 0 ? (
      <Svg height={size.height} style={StyleSheet.absoluteFill} width={size.width}>
        {gradientProps && (
          <Defs>
            <LinearGradient
              id={gradientId}
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
              <ClipPath id={clipId}>
                {shapePath ? <Path d={shapePath} /> : <Polygon points={formatPoints(points)} />}
              </ClipPath>
            </Defs>
            <Image
              clipPath={`url(#${clipId})`}
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
      onLayout={(e) => {
        const newWidth = Math.ceil(e.nativeEvent.layout.width);
        const newHeight = Math.ceil(e.nativeEvent.layout.height);
        setSize((prev) => {
          if (prev.width === newWidth && prev.height === newHeight) return prev;
          return { width: newWidth, height: newHeight };
        });
      }}
      style={viewStyle}
    >
      {renderSvg()}
      {children}
    </View>
  );
};
