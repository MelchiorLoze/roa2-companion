import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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
            <MaterialIcons.Button
              accessibilityLabel="Back"
              backgroundColor="transparent"
              iconStyle={styles.backButtonIcon}
              name="arrow-back"
              onPress={router.back}
              role="button"
              style={styles.backButton}
            />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  topSpacing: {
    height: theme.spacing.s,
    backgroundColor: theme.color.highlight,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.s,
  },
  bottomContainer: (withBackNavigation?: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: withBackNavigation ? theme.spacing.s : theme.spacing.m,
    paddingHorizontal: withBackNavigation ? theme.spacing.s : theme.spacing.l,
    backgroundColor: theme.color.background,
  }),
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
  backButtonIcon: {
    marginRight: 0,
    fontSize: 24,
  },
  title: {
    width: '100%',
    fontFamily: theme.font.primary.italic,
    fontSize: 24,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
