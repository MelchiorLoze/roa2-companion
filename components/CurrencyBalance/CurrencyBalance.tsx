import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import BucksIcon from '@/assets/images/bucks.png';
import CoinsIcon from '@/assets/images/coins.png';
import { Currency } from '@/types/store';

type Props = {
  balance: number;
  currency: Currency;
};

export const CurrencyBalance = ({ balance, currency }: Props) => {
  const leadingZeros = '0'.repeat(10 - balance.toString().length);

  const iconSrc = currency === Currency.COINS ? CoinsIcon : BucksIcon;

  return (
    <View style={styles.container}>
      <Image contentFit="contain" source={iconSrc} style={styles.icon} />
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
    gap: theme.spacing.s,
  },
  leadingZeros: {
    color: theme.color.background,
  },
  label: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.black,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
}));
