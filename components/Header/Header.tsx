import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useCurrencyBalance } from '@/hooks/business';
import { Currency } from '@/types/store';

import { CurrencyBalance } from '../CurrencyBalance/CurrencyBalance';

export const Header = ({ options }: NativeStackHeaderProps) => {
  const { theme } = useUnistyles();
  const { logout } = useAuth();
  const { coinsBalance, bucksBalance } = useCurrencyBalance();

  return (
    <>
      <View style={styles.topContainer}>
        <CurrencyBalance balance={coinsBalance ?? 0} currency={Currency.COINS} />
        <CurrencyBalance balance={bucksBalance ?? 0} currency={Currency.BUCKS} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>{options.title}</Text>
        <FontAwesome.Button
          backgroundColor={theme.color.transparent}
          color={theme.color.danger}
          iconStyle={styles.logoutIcon}
          name="arrow-right-from-bracket"
          onPress={logout}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.s,
    backgroundColor: theme.color.highlight,
    borderBottomWidth: 2,
    borderBottomColor: theme.color.accent,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    paddingLeft: theme.spacing.l,
    backgroundColor: theme.color.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.font.primary.italic,
    textTransform: 'uppercase',
    color: theme.color.white,
  },
  logoutIcon: {
    marginRight: theme.spacing.none,
  },
}));
