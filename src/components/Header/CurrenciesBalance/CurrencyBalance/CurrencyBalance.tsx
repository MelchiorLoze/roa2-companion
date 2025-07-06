import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type Currency, CURRENCY_ICONS } from '@/types/currency';

const MIN_DIGIT_COUNT = 8;

type Props = {
  balance: number;
  currency: Currency;
};

export const CurrencyBalance = ({ balance, currency }: Readonly<Props>) => {
  const balanceDigitCount = balance.toString().length;
  const leadingZeros = '0'.repeat(MIN_DIGIT_COUNT - Math.min(MIN_DIGIT_COUNT, balanceDigitCount));

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
