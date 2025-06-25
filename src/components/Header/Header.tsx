import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '../IconButton/IconButton';
import { Separator } from '../Separator/Separator';
import { CurrenciesBalance } from './CurrenciesBalance/CurrenciesBalance';

type Props = {
  title?: string;
  showCurrencies?: boolean;
  withBackNavigation?: boolean;
};

export const Header = ({ title, showCurrencies, withBackNavigation }: Props) => {
  const router = useRouter();

  return (
    <>
      {showCurrencies ? <CurrenciesBalance style={styles.topContainer} /> : <View style={styles.topSpacing} />}
      <Separator height={2} variant="accent" />
      {title && (
        <View style={styles.bottomContainer(withBackNavigation)}>
          {withBackNavigation && (
            <IconButton iconName="arrow-back" onPress={router.back} size={24} style={styles.backButton} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  topSpacing: {
    height: theme.spacing.s + runtime.insets.top,
    backgroundColor: theme.color.highlight,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.s,
    paddingTop: theme.spacing.s + runtime.insets.top,
    backgroundColor: theme.color.highlight,
  },
  bottomContainer: (withBackNavigation?: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: withBackNavigation ? theme.spacing.s : theme.spacing.m,
    paddingHorizontal: withBackNavigation ? theme.spacing.s : theme.spacing.l,
    backgroundColor: theme.color.background,
  }),
  backButton: {
    padding: theme.spacing.s,
  },
  title: {
    width: '100%',
    fontFamily: theme.font.primary.italic,
    fontSize: 24,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
