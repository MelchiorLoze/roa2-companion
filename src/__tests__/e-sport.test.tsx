import { render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import ESport from '@/app/(private)/e-sport';
import { useGetActiveTournaments } from '@/features/e-sport/hooks/data/useGetActiveTournaments';
import { TournamentState } from '@/features/e-sport/types/tournament';

jest.mock('@/features/e-sport/hooks/data/useGetActiveTournaments');
const useGetActiveTournamentsMock = jest.mocked(useGetActiveTournaments);

const mockTournament = {
  id: 1,
  name: 'Test Tournament',
  url: new URL('https://example.com/tournament/1'),
  imageUrl: new URL('https://example.com/image.png'),
  countryCode: 'US',
  isOnline: true,
  numAttendees: 100,
  state: TournamentState.ONGOING,
  startAt: DateTime.fromISO('2025-01-01T00:00:00Z'),
  endAt: DateTime.fromISO('2025-01-05T23:59:59Z'),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-01-02T10:00:00Z'),
    },
  ],
};

const renderComponent = () => {
  return render(<ESport />);
};

describe('ESport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      tournaments: [],
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeDefined();
  });

  it('shows error message when request fails', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      tournaments: [],
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();

    screen.getByText('An error occurred while loading tournaments. Please try again later.');
  });

  it('shows empty state when no tournaments available', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      tournaments: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();

    screen.getByText('No active tournaments at the moment. Please check back later.');
  });

  it('shows tournament list when tournaments are available', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      tournaments: [mockTournament],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();

    screen.getByText('Test Tournament');
  });
});
