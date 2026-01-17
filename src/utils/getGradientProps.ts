import { type ColorValue } from 'react-native';

export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

export type Gradient<T extends GradientColors> = {
  colors: T;
  times?: { [K in keyof T]: number };
};

type GetGradientPropsOptions<T extends GradientColors> = {
  direction: 'horizontal' | 'vertical';
  gradient: Gradient<T>;
};

type GradientProps<T extends GradientColors> = Readonly<{
  colors: T;
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations?: { [K in keyof T]: number };
}>;

export const getGradientProps = <T extends GradientColors>({
  direction,
  gradient: { colors, times },
}: GetGradientPropsOptions<T>): GradientProps<T> => {
  if (times) {
    // Validate that times are in ascending order
    for (let i = 1; i < times.length; i++) {
      if (times[i] < times[i - 1]) throw new Error('Gradient times must be in ascending order');
      else if (times[i] === times[i - 1]) throw new Error('Gradient times must be unique values');
    }
  }

  const start = times?.[0] ?? 0;
  const end = times?.[times.length - 1] ?? 1;
  const locations = times?.map((pos) => (pos - start) / (end - start)) as GradientProps<T>['locations'];

  const isHorizontal = direction === 'horizontal';
  const isVertical = direction === 'vertical';
  return {
    colors,
    start: { x: isHorizontal ? start : 0, y: isVertical ? start : 0 },
    end: { x: isHorizontal ? end : 0, y: isVertical ? end : 0 },
    locations,
  } as const;
};
