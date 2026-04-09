import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ButtonBackground } from '@/assets/images/ui';

import { FancyText } from '../FancyText/FancyText';
import { NineSlicesImage } from '../NineSlicesImage/NineSlicesImage';
import { ParallelogramView } from '../ParallelogramView/ParallelogramView';

type Props = { label: string; onPress: () => void };

export const Button = ({ label, onPress }: Readonly<Props>) => {
  const { theme } = useUnistyles();

  return (
    <Pressable onPress={onPress} role="button">
      {({ pressed }) => (
        <>
          <NineSlicesImage
            insets={{ right: '27%', left: '27%' }}
            source={ButtonBackground}
            style={StyleSheet.absoluteFill}
          />
          {pressed && <ParallelogramView skewAmount={5} style={styles.pressedBackground} />}
          <View style={styles.button}>
            <FancyText
              style={{
                ...styles.label,
                gradient: { ...theme.color.gradient.labelText(pressed), direction: 'vertical' },
              }}
              text={label.toUpperCase()}
            />
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s + 1, // optical adjustment to compensate for the bottom shadow in the background image
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.font.secondary.bold,
    strokeWidth: 1,
    strokeColor: theme.color.borderPrimary,
  },
  pressedBackground: {
    ...StyleSheet.absoluteFillObject,
    bottom: 2, // optical adjustment to compensate for the bottom shadow in the background image
    backgroundColor: theme.color.buttonSelectedSecondary,
    borderColor: theme.color.buttonSelectedPrimary,
    borderWidth: 2,
  },
}));
