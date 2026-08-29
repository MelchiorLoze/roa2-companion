import { Skia } from '@shopify/react-native-skia';
import { type ComponentProps } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { FancyText } from '../FancyText/FancyText';
import { ParallelogramView } from '../ParallelogramView/ParallelogramView';

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

const borderGradient: ComponentProps<typeof ParallelogramView>['gradient'] = {
  stops: [
    { offset: '2.5%', color: '#422C8F' },
    { offset: '30%', color: '#8F60D0' },
  ],
  start: { x: '9%', y: '100%' },
  end: { x: '0%', y: '-10%' },
} as const;

const innerBorderGradient: ComponentProps<typeof ParallelogramView>['gradient'] = {
  stops: [
    { offset: '27%', color: '#5619BC' },
    { offset: '55%', color: '#7E48D1' },
  ],
  start: { x: '0%', y: '0%' },
  end: { x: '4%', y: '100%' },
} as const;

const selectedBackgroundGradient: ComponentProps<typeof ParallelogramView>['gradient'] = {
  stops: [
    { offset: '0%', color: '#EDCFFF' },
    { offset: '100%', color: '#DDAFFF' },
  ],
  start: { x: '0%', y: '0%' },
  end: { x: '0%', y: '100%' },
} as const;

const labelShadow = (color: string) => ({
  color: Skia.Color(color),
  offset: { x: 1, y: 0 },
  blurRadius: 0.001, // 0 radius is not supported
});

type FaceProps = {
  title: string;
  borderStyle: StyleProp<ViewStyle>;
  backgroundStyle: StyleProp<ViewStyle>;
  backgroundGradient?: ComponentProps<typeof ParallelogramView>['gradient'];
  labelStyle: ComponentProps<typeof FancyText>['style'];
};

const TabFace = ({ title, borderStyle, backgroundStyle, backgroundGradient, labelStyle }: Readonly<FaceProps>) => (
  <ParallelogramView skewAmount={5} style={borderStyle}>
    <ParallelogramView gradient={backgroundGradient} skewAmount={5} style={backgroundStyle}>
      <FancyText style={labelStyle} text={title} />
    </ParallelogramView>
  </ParallelogramView>
);

export const Tab = ({ title, selected, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable disabled={selected} onPress={onPress} style={styles.container}>
      {({ pressed }) =>
        pressed ? (
          <TabFace
            backgroundStyle={styles.pressedBackground}
            borderStyle={styles.pressedBorder}
            labelStyle={{
              ...styles.labelPressed,
              shadow: labelShadow(theme.color.tabPressedLabelShadow),
            }}
            title={title}
          />
        ) : selected ? (
          <TabFace
            backgroundGradient={selectedBackgroundGradient}
            backgroundStyle={styles.selectedBackground}
            borderStyle={styles.selectedBorder}
            labelStyle={{
              ...styles.labelSelected,
              shadow: labelShadow(theme.color.tabLabelShadow),
            }}
            title={title}
          />
        ) : (
          <ParallelogramView gradient={borderGradient} skewAmount={5} style={styles.border}>
            <ParallelogramView gradient={innerBorderGradient} skewAmount={5} style={styles.innerBorder}>
              <TabFace
                backgroundStyle={styles.innerBackground}
                borderStyle={styles.background}
                labelStyle={{
                  ...styles.label,
                  gradient: { ...theme.color.gradient.labelText(), direction: 'vertical' },
                  shadow: labelShadow(theme.color.tabLabelShadow),
                }}
                title={title}
              />
            </ParallelogramView>
          </ParallelogramView>
        )
      }
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    maxWidth: '33%',
  },
  border: {
    padding: 1,
    borderRadius: 4,
  },
  innerBorder: {
    padding: 1,
    borderRadius: 4,
  },
  background: {
    padding: 1,
    borderRadius: 4,
    backgroundColor: theme.color.tabBackground,
  },
  innerBackground: {
    padding: 3,
    borderRadius: 2,
    backgroundColor: theme.color.tabInnerBackground,
    alignItems: 'center',
  },
  label: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    strokeWidth: 1.5,
    strokeColor: theme.color.tabLabelOutline,
  },
  pressedBorder: {
    padding: theme.spacing.xxs,
    borderRadius: 4,
    backgroundColor: theme.color.buttonSelectedPrimary,
  },
  pressedBackground: {
    padding: theme.spacing.xs,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: theme.color.tabPressedBackground,
  },
  labelPressed: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: theme.color.black,
    strokeWidth: 2,
  },
  selectedBorder: {
    padding: theme.spacing.xxs,
    borderRadius: 4,
    backgroundColor: theme.color.tabSelectedBorder,
  },
  selectedBackground: {
    padding: theme.spacing.xs,
    borderRadius: 2,
    alignItems: 'center',
  },
  labelSelected: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: theme.color.tabSelectedLabel,
    strokeWidth: 2,
  },
}));
