import { render, screen } from '@testing-library/react-native';

import { Currency } from '@/types/currency';

import { CurrencyBalance } from './CurrencyBalance';

describe('CurrencyBalance', () => {
  it('renders the balance with correct amount of leading zeros', () => {
    render(<CurrencyBalance balance={0} currency={Currency.COINS} />);
    expect(screen.getByText('00000000')).toBeTruthy();

    render(<CurrencyBalance balance={1} currency={Currency.COINS} />);
    expect(screen.getByText('00000001')).toBeTruthy();

    render(<CurrencyBalance balance={123} currency={Currency.COINS} />);
    expect(screen.getByText('00000123')).toBeTruthy();

    render(<CurrencyBalance balance={12345678} currency={Currency.COINS} />);
    expect(screen.getByText('12345678')).toBeTruthy();

    render(<CurrencyBalance balance={123456789} currency={Currency.COINS} />);
    expect(screen.getByText('123456789')).toBeTruthy();
  });
});
