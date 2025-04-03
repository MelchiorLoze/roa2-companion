import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useCurrencyBalance } from '@/hooks/business';
import { Currency } from '@/types/store';

import { CurrencyBalance } from '../CurrencyBalance/CurrencyBalance';

export const Header = ({ options }: BottomTabHeaderProps) => {
  const { coinsBalance, bucksBalance, medalsBalance } = useCurrencyBalance();

  return (
    <>
      <View style={styles.topContainer}>
        <CurrencyBalance balance={coinsBalance} currency={Currency.COINS} />
        <CurrencyBalance balance={bucksBalance} currency={Currency.BUCKS} />
        <CurrencyBalance balance={medalsBalance} currency={Currency.MEDALS} />
      </View>
      {options.title && (
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>{options.title}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderBottomWidth: 2,
    borderBottomColor: theme.color.accent,
  },
  bottomContainer: {
    padding: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    backgroundColor: theme.color.background,
  },
  title: {
    fontFamily: theme.font.primary.italic,
    fontSize: 24,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
