import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ButtonBackground } from '@/assets/images/ui';

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
            style={styles.backgroundContainer}
          />
          <View style={styles.button}>
            <Text style={[styles.label, pressed && styles.labelPressed]}>{label}</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  backgroundContainer: StyleSheet.absoluteFillObject,
  button: {
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  labelPressed: {
    color: theme.color.black,
  },
}));
