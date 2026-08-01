import { type PropsWithChildren, useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { Path, Polygon, Svg } from 'react-native-svg';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  skewAmount: number;
}>;

type Point = [number, number];

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

export const ParallelogramView = ({ style, skewAmount, children }: Readonly<Props>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const {
    backgroundColor = 'transparent',
    borderColor,
    borderWidth = 0,
    borderRadius: rawBorderRadius = 0,
    ...viewStyle
  } = StyleSheet.flatten(style ?? {});
  const borderRadius = typeof rawBorderRadius === 'number' ? rawBorderRadius : 0;
  const skew = Math.abs(skewAmount);

  // Positive skewAmount: top edge shifted right (leans like /)
  // Negative skewAmount: top edge shifted left (leans like \)
  const points: Point[] =
    skewAmount >= 0
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

  return (
    <View onLayout={(e) => setSize(e.nativeEvent.layout)} style={viewStyle}>
      {size.width > 0 && size.height > 0 && (
        <Svg height={size.height} style={StyleSheet.absoluteFill} width={size.width}>
          {borderRadius > 0 ? (
            <Path
              d={roundedPolygonPath(points, borderRadius)}
              fill={backgroundColor}
              stroke={borderColor}
              strokeLinejoin="round"
              strokeWidth={borderWidth}
            />
          ) : (
            <Polygon
              fill={backgroundColor}
              points={formatPoints(points)}
              stroke={borderColor}
              strokeWidth={borderWidth}
            />
          )}
        </Svg>
      )}
      {children}
    </View>
  );
};
