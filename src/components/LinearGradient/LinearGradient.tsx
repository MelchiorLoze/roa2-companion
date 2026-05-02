import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { type PropsWithChildren } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { getGradientProps, type Gradient, type GradientColors } from '@/utils/getGradientProps';

type HorizontalOrVertical = Either<{ horizontal: true }, { vertical: true }>;

type Props<T extends GradientColors> = PropsWithChildren<
  {
    style?: StyleProp<ViewStyle>;
  } & HorizontalOrVertical &
    Gradient<T>
>;

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
