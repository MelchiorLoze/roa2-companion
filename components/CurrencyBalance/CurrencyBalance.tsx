import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Currency, CURRENCY_ICONS } from '@/types/store';

type Props = {
  balance: number;
  currency: Currency;
};

export const CurrencyBalance = ({ balance, currency }: Props) => {
  const leadingZeros = '0'.repeat(8 - balance.toString().length);

  return (
    <View style={styles.container}>
      <Image contentFit="contain" source={CURRENCY_ICONS[currency]} style={styles.icon} />
      <Text style={styles.label}>
        <Text style={styles.leadingZeros}>{leadingZeros}</Text>
        {balance}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  leadingZeros: {
    color: theme.color.background,
  },
  label: {
    fontFamily: theme.font.secondary.black,
    fontSize: 16,
    color: theme.color.white,
  },
  icon: {
    width: 20,
    height: 20,
  },
}));
