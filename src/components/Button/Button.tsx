import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ButtonBackground } from '@/assets/images/ui';

import { FancyText } from '../FancyText/FancyText';
import { NineSlicesImage } from '../NineSlicesImage/NineSlicesImage';

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
          <View style={styles.button}>
            <FancyText
              style={{
                ...styles.label(pressed),
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
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs + 1, // optical adjustment to compensate for the shadow in the background image
    paddingHorizontal: theme.spacing.xl,
  },
  label: (pressed: boolean) => ({
    fontSize: 16,
    fontFamily: theme.font.secondary.bold,
    strokeWidth: 1.5,
    strokeColor: pressed ? theme.color.transparent : theme.color.borderPrimary,
  }),
}));
