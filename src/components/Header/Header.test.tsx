import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { useCurrencyBalance } from '@/hooks/business/useCurrencyBalance/useCurrencyBalance';

import { Header } from './Header';

jest.mock('expo-router');
jest.mock('@/hooks/business/useCurrencyBalance/useCurrencyBalance');

const useRouterMock = jest.mocked(useRouter);
const useCurrencyBalanceMock = jest.mocked(useCurrencyBalance);

const backMock = jest.fn();

const defaultCurrencyBalanceReturnValue: ReturnType<typeof useCurrencyBalance> = {
  coinsBalance: 0,
  bucksBalance: 0,
  medalsBalance: 0,
  isLoading: false,
  isError: false,
};

describe('Header', () => {
  beforeEach(() => {
    useRouterMock.mockReturnValue({
      back: backMock,
    } as unknown as ReturnType<typeof useRouter>);

    useCurrencyBalanceMock.mockReturnValue(defaultCurrencyBalanceReturnValue);
  });

  it('renders without crashing when no props are provided', () => {
    render(<Header />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with currencies balance', () => {
    render(<Header showCurrencies />);

    expect(screen.getByTestId('currencies-balance')).toBeTruthy();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with title', () => {
    render(<Header title="Test Title" />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with title and back navigation', () => {
    render(<Header title="Test Title" withBackNavigation />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.getByText('Test Title')).toBeTruthy();

    const backButton = screen.getByRole('button');
    fireEvent.press(backButton);

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('does not render back navigation when no title is provided', () => {
    render(<Header withBackNavigation />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('matches the snapshot', () => {
    const tree = render(<Header showCurrencies title="Test title" withBackNavigation />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
