import { type ComponentProps } from 'react';
import { type ColorValue, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { TabBorderBackground, TabInnerBorderBackground } from '@/assets/images/ui';

import { FancyText } from '../FancyText/FancyText';
import { ParallelogramView } from '../ParallelogramView/ParallelogramView';

type FaceProps = {
  label: string;
  labelStyle: ComponentProps<typeof FancyText>['style'];
  labelGradient?: ComponentProps<typeof FancyText>['gradient'];
  labelShadowColor: ColorValue;
  borderStyle: StyleProp<ViewStyle>;
  backgroundStyle: StyleProp<ViewStyle>;
  backgroundGradient?: ComponentProps<typeof ParallelogramView>['gradient'];
};

const TabFace = ({
  label,
  labelStyle,
  labelGradient,
  labelShadowColor,
  borderStyle,
  backgroundStyle,
  backgroundGradient,
}: Readonly<FaceProps>) => (
  <ParallelogramView skewAmount={5} style={borderStyle}>
    <ParallelogramView gradient={backgroundGradient} skewAmount={5} style={backgroundStyle}>
      <FancyText
        gradient={labelGradient}
        shadow={{
          color: labelShadowColor,
          offset: { x: 1, y: 0 },
          blurRadius: 0,
        }}
        style={labelStyle}
        text={label}
      />
    </ParallelogramView>
  </ParallelogramView>
);

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const Tab = ({ label, selected, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable disabled={selected} onPress={onPress} style={styles.container}>
      {({ pressed }) =>
        pressed ? (
          <TabFace
            backgroundStyle={styles.pressedBackground}
            borderStyle={styles.pressedBorder}
            label={label}
            labelShadowColor={theme.color.tabPressedLabelShadow}
            labelStyle={styles.labelPressed}
          />
        ) : selected ? (
          <TabFace
            backgroundGradient={{ ...theme.color.gradient.tabSelectedBackground, direction: 'vertical' }}
            backgroundStyle={styles.selectedBackground}
            borderStyle={styles.selectedBorder}
            label={label}
            labelShadowColor={theme.color.tabLabelShadow}
            labelStyle={styles.labelSelected}
          />
        ) : (
          <ParallelogramView backgroundImage={TabBorderBackground} skewAmount={5} style={styles.border}>
            <ParallelogramView backgroundImage={TabInnerBorderBackground} skewAmount={5} style={styles.innerBorder}>
              <TabFace
                backgroundStyle={styles.innerBackground}
                borderStyle={styles.background}
                label={label}
                labelGradient={{ ...theme.color.gradient.labelText(), direction: 'vertical' }}
                labelShadowColor={theme.color.tabLabelShadow}
                labelStyle={styles.label}
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
    padding: theme.spacing.xxs,
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
    fontFamily: theme.font.primary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    strokeWidth: 1.5,
    strokeColor: theme.color.tabLabelOutline,
  },
  // PRESSED STATE
  pressedBorder: {
    padding: theme.spacing.xxs,
    borderRadius: 4,
    backgroundColor: theme.color.buttonSelectedPrimary,
  },
  pressedBackground: {
    padding: 5,
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: theme.color.tabPressedBackground,
  },
  labelPressed: {
    fontFamily: theme.font.primary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: theme.color.black,
    strokeWidth: 1.5,
  },
  // SELECTED STATE
  selectedBorder: {
    padding: theme.spacing.xxs,
    borderRadius: 4,
    backgroundColor: theme.color.tabSelectedBorder,
  },
  selectedBackground: {
    padding: 5,
    borderRadius: 2,
    alignItems: 'center',
  },
  labelSelected: {
    fontFamily: theme.font.primary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: theme.color.tabSelectedLabel,
    strokeWidth: 1.5,
  },
}));
