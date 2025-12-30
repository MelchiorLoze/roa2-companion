import { render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import ESport from '@/app/(private)/e-sport';
import { useGetActiveTournaments } from '@/features/e-sport/hooks/data/useGetActiveTournaments';
import { type Tournament, TournamentState } from '@/features/e-sport/types/tournament';

jest.mock('@/features/e-sport/hooks/data/useGetActiveTournaments');

const useGetActiveTournamentsMock = jest.mocked(useGetActiveTournaments);

const mockTournament1: Tournament = {
  id: 1,
  name: 'Test Tournament 1',
  url: new URL('https://example.com/tournament/1'),
  imageUrl: new URL('https://example.com/image1.png'),
  countryCode: 'US',
  isOnline: true,
  numAttendees: 100,
  state: TournamentState.ONGOING,
  startAt: DateTime.fromISO('2025-01-05T09:00:00Z'),
  endAt: DateTime.fromISO('2025-01-05T18:00:00Z'),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-01-05T10:00:00Z'),
    },
  ],
};

const mockTournament2: Tournament = {
  id: 2,
  name: 'Test Tournament 2',
  url: new URL('https://example.com/tournament/2'),
  imageUrl: new URL('https://example.com/image2.png'),
  countryCode: 'FR',
  isOnline: false,
  numAttendees: 200,
  state: TournamentState.UPCOMING,
  startAt: DateTime.fromISO('2025-02-01T09:00:00Z'),
  endAt: DateTime.fromISO('2025-02-05T18:00:00Z'),
  events: [
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 100,
      startAt: DateTime.fromISO('2025-02-02T10:00:00Z'),
    },
  ],
};

const mockTournament3: Tournament = {
  id: 3,
  name: 'Test Tournament 3',
  url: new URL('https://example.com/tournament/3'),
  imageUrl: new URL('https://example.com/image3.png'),
  countryCode: undefined,
  isOnline: true,
  numAttendees: 10,
  state: TournamentState.COMPLETED,
  startAt: DateTime.fromISO('2025-03-28T08:30:00Z'),
  endAt: DateTime.fromISO('2025-04-03T11:15:00Z'),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-03-30T08:30:00Z'),
    },
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 100,
      startAt: DateTime.fromISO('2025-04-02T11:15:00Z'),
    },
  ],
};

const defaultGetActiveTournamentsReturnValue: ReturnType<typeof useGetActiveTournaments> = {
  tournaments: [],
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  isRefetching: false,
};

describe('ESport', () => {
  beforeEach(() => {
    useGetActiveTournamentsMock.mockReturnValue(defaultGetActiveTournamentsReturnValue);
  });

  it('matches snapshot', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsReturnValue,
      tournaments: [mockTournament1, mockTournament2, mockTournament3],
    });
    const tree = render(<ESport />).toJSON();

    // Remove circular references for snapshot testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete tree.props.refreshControl;

    expect(tree).toMatchSnapshot();
  });

  it('shows spinner when loading', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsReturnValue,
      isLoading: true,
    });

    render(<ESport />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error message when request fails', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultGetActiveTournamentsReturnValue,
      isError: true,
    });

    render(<ESport />);

    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('shows empty state when no tournaments available', () => {
    render(<ESport />);

    expect(screen.getByText('No active tournaments at the moment. Please check back later.')).toBeTruthy();
  });
});
