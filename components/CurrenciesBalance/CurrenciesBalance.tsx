import { StyleProp, View, ViewStyle } from 'react-native';

import { useCurrencyBalance } from '@/hooks/business';
import { Currency } from '@/types/store';

import { CurrencyBalance } from './CurrencyBalance/CurrencyBalance';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const CurrenciesBalance = ({ style }: Props) => {
  const { coinsBalance, bucksBalance, medalsBalance } = useCurrencyBalance();

  return (
    <View style={style}>
      <CurrencyBalance balance={coinsBalance} currency={Currency.COINS} />
      <CurrencyBalance balance={bucksBalance} currency={Currency.BUCKS} />
      <CurrencyBalance balance={medalsBalance} currency={Currency.MEDALS} />
    </View>
  );
};
