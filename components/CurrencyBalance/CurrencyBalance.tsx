import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BucksIcon, CoinsIcon } from '@/assets/images';
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
    width: 24,
    height: 24,
  },
}));
