import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { NineSlicesImage } from '@/components/NineSlicesImage/NineSlicesImage';
import { type Currency, CURRENCY_BACKGROUNDS } from '@/types/currency';

const formatCurrency = (amount: number) => {
  // adds commas every three digits
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

type Props = {
  balance: number;
  currency: Currency;
};

export const CurrencyBalance = ({ balance, currency }: Readonly<Props>) => {
  return (
    <View style={styles.container}>
      <NineSlicesImage
        insets={{ top: '49%', right: '39%', bottom: '49%', left: '59%' }}
        source={CURRENCY_BACKGROUNDS[currency]}
        style={StyleSheet.absoluteFill}
      />
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.label(currency)}>
        {formatCurrency(balance)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: -theme.spacing.l,
    paddingVertical: theme.spacing.xl,
    paddingRight: theme.spacing.m,
    paddingLeft: '11%',
  },
  label: (currency: Currency) => ({
    fontFamily: theme.font.secondary.boldWide,
    fontSize: 14,
    color: theme.color[currency],
    lineHeight: 14,
    letterSpacing: -0.5,
    textShadowColor: theme.color.currencyLabelShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.001, // 0 radius is not supported
  }),
}));
