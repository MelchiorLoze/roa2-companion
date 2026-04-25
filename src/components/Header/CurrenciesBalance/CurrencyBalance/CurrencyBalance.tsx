import { Skia } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { FancyText } from '@/components/FancyText/FancyText';
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
  const { theme } = useUnistyles();
  return (
    <View style={styles.container}>
      <NineSlicesImage
        insets={{ top: '49%', right: '39%', bottom: '49%', left: '59%' }}
        source={CURRENCY_BACKGROUNDS[currency]}
        style={StyleSheet.absoluteFill}
      />
      <FancyText
        style={{
          ...styles.label(currency),
          shadow: {
            color: Skia.Color(theme.color.currencyLabelShadow),
            offset: { x: 1, y: 1 },
            blurRadius: 0.001, // 0 radius is not supported
          },
        }}
        text={formatCurrency(balance)}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexShrink: 1,
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
    skew: -0.178001, // WBP_CurrencyDisplayer2
  }),
}));
