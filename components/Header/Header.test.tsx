import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { Header } from './Header';

jest.requireMock('@expo/vector-icons').MaterialIcons = { Button: Pressable };

jest.mock('expo-router');
const backMock = jest.fn();
jest.mocked(useRouter).mockReturnValue({
  back: backMock,
} as unknown as ReturnType<typeof useRouter>);

jest.mock('@/hooks/business', () => ({
  useCurrencyBalance: jest.fn(() => ({
    coinsBalance: 0,
    bucksBalance: 0,
    medalsBalance: 0,
    isLoading: false,
    isError: false,
  })),
}));

describe('Header', () => {
  it('should render without crashing when no props are provided', () => {
    render(<Header />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('should render with currencies balance', () => {
    render(<Header showCurrencies />);

    screen.getByTestId('currencies-balance');
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('should render with title', () => {
    render(<Header title="Test Title" />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    screen.getByText('Test Title');
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('should render with title and back navigation', () => {
    render(<Header title="Test Title" withBackNavigation />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    screen.getByText('Test Title');

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.press(backButton);

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('should not render back navigation when no title is provided', () => {
    render(<Header withBackNavigation />);

    expect(screen.queryByTestId('currencies-balance')).toBeNull();
    expect(screen.queryByText('Test Title')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });
});
