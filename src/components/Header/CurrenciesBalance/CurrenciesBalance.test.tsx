import { render, screen } from '@testing-library/react-native';

import { useCurrencyBalance } from '@/hooks/business/useCurrencyBalance/useCurrencyBalance';

import { CurrenciesBalance } from './CurrenciesBalance';

jest.mock('@/hooks/business/useCurrencyBalance/useCurrencyBalance');
const useCurrencyBalanceMock = jest.mocked(useCurrencyBalance);

describe('CurrenciesBalance', () => {
  it('renders correctly when the balances are loaded', () => {
    useCurrencyBalanceMock.mockReturnValue({
      coinsBalance: 208092,
      bucksBalance: 2850,
      medalsBalance: 13,
      isLoading: false,
      isError: false,
    });

    render(<CurrenciesBalance />);

    expect(useCurrencyBalanceMock).toHaveBeenCalledTimes(1);
    screen.getByText('00208092');
    screen.getByText('00002850');
    screen.getByText('00000013');
  });

  it('renders correctly when the balances are loading', () => {
    useCurrencyBalanceMock.mockReturnValue({
      coinsBalance: 0,
      bucksBalance: 0,
      medalsBalance: 0,
      isLoading: true,
      isError: false,
    });

    render(<CurrenciesBalance />);

    expect(useCurrencyBalanceMock).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText('00000000')).toHaveLength(3);
  });
});
