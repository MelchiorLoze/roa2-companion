import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { type PropsWithChildren } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { getGradientProps, type Gradient, type GradientColors } from '@/utils/getGradientProps';

type HorizontalOrVertical =
  | {
      horizontal: true;
      vertical?: never;
    }
  | {
      horizontal?: never;
      vertical: true;
    };

type Props<T extends GradientColors> = {
  style?: StyleProp<ViewStyle>;
} & HorizontalOrVertical &
  Gradient<T> &
  PropsWithChildren;

export const LinearGradient = <T extends GradientColors>({
  style,
  colors,
  times,
  horizontal,
  children,
}: Readonly<Props<T>>) => {
  const gradientProps = getGradientProps({
    direction: horizontal ? 'horizontal' : 'vertical',
    gradient: { colors, times },
  });

  return (
    <ExpoLinearGradient {...gradientProps} style={style}>
      {children}
    </ExpoLinearGradient>
  );
};
