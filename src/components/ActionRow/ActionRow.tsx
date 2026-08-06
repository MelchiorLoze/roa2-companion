import { MaterialIcons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { type ExternalPathString, useRouter } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ButtonBackground } from '@/assets/images/ui';

import { FancyText } from '../FancyText/FancyText';
import { NineSlicesImage } from '../NineSlicesImage/NineSlicesImage';
import { ParallelogramView } from '../ParallelogramView/ParallelogramView';

type LinkOrButton = Either<{ url: URL }, { onPress: () => void }>;

type Props = {
  label: string;
  logo?: ImageSource;
  iconName: ComponentProps<typeof MaterialIcons>['name'];
} & LinkOrButton;

export const ActionRow = ({ label, url, logo, iconName, onPress }: Readonly<Props>) => {
  const router = useRouter();
  const { theme } = useUnistyles();

  return (
    <Pressable
      onPress={() => (url ? router.push(url.toString() as ExternalPathString) : onPress())}
      role={url ? 'link' : 'button'}
      style={styles.container}
    >
      {({ pressed }) => (
        <>
          <NineSlicesImage
            insets={{ right: '27%', left: '27%' }}
            source={ButtonBackground}
            style={StyleSheet.absoluteFill}
          />
          {pressed && <ParallelogramView skewAmount={5} style={styles.pressedBackground} />}

          <FancyText
            style={{
              ...styles.label,
              gradient: { ...theme.color.gradient.labelText(pressed), direction: 'vertical' },
            }}
            text={label}
          />
          {logo && <Image contentFit="contain" source={logo} style={styles.logo} />}
          <MaterialIcons
            color={pressed ? theme.color.black : theme.color.white}
            name={iconName}
            size={20}
            style={styles.icon}
          />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
  },
  pressedBackground: {
    ...StyleSheet.absoluteFillObject,
    bottom: 2, // optical adjustment to compensate for the bottom shadow in the background image
    backgroundColor: theme.color.buttonSelectedSecondary,
    borderColor: theme.color.buttonSelectedPrimary,
    borderWidth: 2,
    borderRadius: 2,
  },
  logo: {
    width: 18 * runtime.fontScale,
    aspectRatio: 1,
  },
  label: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  icon: {
    marginLeft: 'auto',
  },
}));
