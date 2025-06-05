import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useCurrencyBalance } from '@/hooks/business/useCurrencyBalance/useCurrencyBalance';
import { Currency } from '@/types/currency';

import { CurrencyBalance } from './CurrencyBalance/CurrencyBalance';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const CurrenciesBalance = ({ style }: Props) => {
  const { coinsBalance, bucksBalance, medalsBalance } = useCurrencyBalance();

  return (
    <View style={style} testID="currencies-balance">
      <CurrencyBalance balance={coinsBalance} currency={Currency.COINS} />
      <CurrencyBalance balance={bucksBalance} currency={Currency.BUCKS} />
      <CurrencyBalance balance={medalsBalance} currency={Currency.MEDALS} />
    </View>
  );
};
