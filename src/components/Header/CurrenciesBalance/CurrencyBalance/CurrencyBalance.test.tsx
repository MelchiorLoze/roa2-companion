import { render, screen } from '@testing-library/react-native';

import { Currency } from '@/types/currency';

import { CurrencyBalance } from './CurrencyBalance';

describe('CurrencyBalance', () => {
  it('renders correctly with different amounts', async () => {
    const { rerender } = await render(<CurrencyBalance balance={0} currency={Currency.MEDALS} />);
    expect(screen.getByText('0')).toBeTruthy();

    await rerender(<CurrencyBalance balance={1234} currency={Currency.BUCKS} />);
    expect(screen.getByText('1,234')).toBeTruthy();

    await rerender(<CurrencyBalance balance={12345678} currency={Currency.COINS} />);
    expect(screen.getByText('12,345,678')).toBeTruthy();

    await rerender(<CurrencyBalance balance={1234567890} currency={Currency.MEDALS} />);
    expect(screen.getByText('1,234,567,890')).toBeTruthy();
  });
});
