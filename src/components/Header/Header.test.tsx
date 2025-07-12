import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { Header } from './Header';

jest.mock('expo-router');
const backMock = jest.fn();
jest.mocked(useRouter).mockReturnValue({
  back: backMock,
} as unknown as ReturnType<typeof useRouter>);

jest.mock('@/hooks/business/useCurrencyBalance/useCurrencyBalance', () => ({
  useCurrencyBalance: jest.fn(() => ({
    coinsBalance: 0,
    bucksBalance: 0,
    medalsBalance: 0,
    isLoading: false,
    isError: false,
  })),
}));

describe('Header', () => {
  it('renders without crashing when no props are provided', () => {
    render(<Header />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with currencies balance', () => {
    render(<Header showCurrencies />);

    screen.getByTestId('currencies-balance');
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with title', () => {
    render(<Header title="Test Title" />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    screen.getByText('Test Title');
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders with title and back navigation', () => {
    render(<Header title="Test Title" withBackNavigation />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    screen.getByText('Test Title');

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
