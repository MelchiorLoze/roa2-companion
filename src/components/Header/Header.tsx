import { Image, ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { HeaderBackground } from '@/assets/images/ui';
import { LeftArrowIcon } from '@/assets/images/ui/icons';

import { LinearGradient } from '../LinearGradient/LinearGradient';
import { CurrenciesBalance } from './CurrenciesBalance/CurrenciesBalance';

type Props = {
  title?: string;
  showCurrencies?: boolean;
  withBackNavigation?: boolean;
};

export const Header = ({ title, showCurrencies, withBackNavigation }: Readonly<Props>) => {
  const { theme } = useUnistyles();
  const router = useRouter();

  return (
    <>
      <ImageBackground contentFit="fill" source={HeaderBackground} style={StyleSheet.absoluteFill} />
      <LinearGradient {...theme.color.gradient.headerOverlay} style={styles.overlay} vertical>
        <LinearGradient {...theme.color.gradient.headerShadow} style={styles.shadow} vertical />
      </LinearGradient>
      <View style={styles.separator} />

      {showCurrencies ? <CurrenciesBalance style={styles.topContainer} /> : <View style={styles.topSpacing} />}

      {title && (
        <LinearGradient
          {...theme.color.gradient.headerTitleBackground}
          horizontal
          style={styles.titleContainer(withBackNavigation)}
        >
          {withBackNavigation && (
            <Pressable onPress={router.back} role="button" style={styles.backButton}>
              <Image source={LeftArrowIcon} style={styles.backButtonIcon} />
            </Pressable>
          )}
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      )}
    </>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  overlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    bottom: 2.5,
  },
  shadow: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    height: 6,
    transform: [{ translateY: 1 }],
  },
  separator: {
    position: 'absolute',
    height: 2,
    left: 0,
    right: 0,
    bottom: 0.5,
    backgroundColor: theme.color.headerSeparator,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: theme.spacing.xs + runtime.insets.top,
    paddingBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
    gap: theme.spacing.xs,
  },
  topSpacing: {
    height: theme.spacing.s + runtime.insets.top,
  },
  titleContainer: (withBackNavigation?: boolean) => ({
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: withBackNavigation ? theme.spacing.xs : theme.spacing.s,
    paddingLeft: withBackNavigation ? theme.spacing.s : theme.spacing.m,
    paddingRight: theme.spacing.xxl,
    marginBottom: theme.spacing.s,
  }),
  backButton: {
    padding: theme.spacing.s,
  },
  backButtonIcon: {
    width: 18,
    height: 18,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 20,
    color: theme.color.headerTitle,
    textTransform: 'uppercase',
  },
}));
