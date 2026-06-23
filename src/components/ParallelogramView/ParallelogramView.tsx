import { type PropsWithChildren, useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { Polygon, Svg } from 'react-native-svg';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  skewAmount: number;
}>;

export const ParallelogramView = ({ style, skewAmount, children }: Readonly<Props>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const {
    backgroundColor = 'transparent',
    borderColor,
    borderWidth = 0,
    ...viewStyle
  } = StyleSheet.flatten(style ?? {});
  const skew = Math.abs(skewAmount);

  // Positive skewAmount: top edge shifted right (leans like /)
  // Negative skewAmount: top edge shifted left (leans like \)
  const points =
    skewAmount >= 0
      ? `${skew},${borderWidth} ${size.width - borderWidth},${borderWidth} ${size.width - skew},${size.height - borderWidth} ${borderWidth},${size.height - borderWidth}`
      : `${borderWidth},${borderWidth} ${size.width - skew},${borderWidth} ${size.width},${size.height - borderWidth} ${skew},${size.height - borderWidth}`;

  return (
    <View onLayout={(e) => setSize(e.nativeEvent.layout)} style={viewStyle}>
      {size.width > 0 && size.height > 0 && (
        <Svg height={size.height} style={StyleSheet.absoluteFill} width={size.width}>
          <Polygon
            fill={backgroundColor}
            points={points}
            stroke={borderColor}
            strokeLinejoin="round"
            strokeWidth={borderWidth}
          />
        </Svg>
      )}
      {children}
    </View>
  );
};
