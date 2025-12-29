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

const defaultGetActiveTournamentsValue: ReturnType<typeof useGetActiveTournaments> = {
  tournaments: [],
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  isRefetching: false,
};

describe('ESport', () => {
  beforeEach(() => {
    useGetActiveTournamentsMock.mockReturnValue(defaultGetActiveTournamentsValue);
  });

  it('shows spinner when loading', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsValue,
      isLoading: true,
    });

    render(<ESport />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error message when request fails', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsValue,
      isError: true,
    });

    render(<ESport />);

    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('shows empty state when no tournaments available', () => {
    render(<ESport />);

    expect(screen.getByText('No active tournaments at the moment. Please check back later.')).toBeTruthy();
  });

  it('shows tournament list when tournaments are available', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsValue,
      tournaments: [mockTournament],
    });

    render(<ESport />);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
  });
});
