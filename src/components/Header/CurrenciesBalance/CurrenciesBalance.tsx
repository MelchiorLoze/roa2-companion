import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useCurrencyBalance } from '@/hooks/business/useCurrencyBalance/useCurrencyBalance';
import { Currency } from '@/types/currency';

import { CurrencyBalance } from './CurrencyBalance/CurrencyBalance';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const CurrenciesBalance = ({ style }: Readonly<Props>) => {
  const { coinsBalance, bucksBalance, medalsBalance } = useCurrencyBalance();

  return (
    <View style={style} testID="currencies-balance">
      <CurrencyBalance balance={coinsBalance ?? 0} currency={Currency.COINS} />
      <CurrencyBalance balance={bucksBalance ?? 0} currency={Currency.BUCKS} />
      <CurrencyBalance balance={medalsBalance ?? 0} currency={Currency.MEDALS} />
    </View>
  );
};
