import { fireEvent, render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import ESport from '@/app/(private)/e-sport';
import { useGetActiveTournaments } from '@/features/e-sport/hooks/data/useGetActiveTournaments/useGetActiveTournaments';
import { useGetPastTournaments } from '@/features/e-sport/hooks/data/useGetPastTournaments/useGetPastTournaments';
import { type Tournament, TournamentState } from '@/features/e-sport/types/tournament';

jest.mock('@/features/e-sport/hooks/data/useGetActiveTournaments/useGetActiveTournaments');
jest.mock('@/features/e-sport/hooks/data/useGetPastTournaments/useGetPastTournaments');

const useGetActiveTournamentsMock = jest.mocked(useGetActiveTournaments);
const useGetPastTournamentsMock = jest.mocked(useGetPastTournaments);

const mockTournament1: Tournament = {
  id: 1,
  name: 'Test Tournament 1',
  url: new URL('https://example.com/tournament/1'),
  imageUrl: new URL('https://example.com/image1.png'),
  countryCode: 'US',
  isOnline: true,
  numAttendees: 100,
  state: TournamentState.ONGOING,
  startAt: DateTime.fromISO('2025-01-05T09:00:00Z', { zone: 'utc' }),
  endAt: DateTime.fromISO('2025-01-05T18:00:00Z', { zone: 'utc' }),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-01-05T10:00:00Z', { zone: 'utc' }),
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
  startAt: DateTime.fromISO('2025-02-01T09:00:00Z', { zone: 'utc' }),
  endAt: DateTime.fromISO('2025-02-05T18:00:00Z', { zone: 'utc' }),
  events: [
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 100,
      startAt: DateTime.fromISO('2025-02-02T10:00:00Z', { zone: 'utc' }),
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
  startAt: DateTime.fromISO('2025-03-28T08:30:00Z', { zone: 'utc' }),
  endAt: DateTime.fromISO('2025-04-03T11:15:00Z', { zone: 'utc' }),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-03-30T08:30:00Z', { zone: 'utc' }),
    },
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 100,
      startAt: DateTime.fromISO('2025-04-02T11:15:00Z', { zone: 'utc' }),
    },
  ],
};

const mockRefetchActive = jest.fn();
const mockRefetchPast = jest.fn();

const defaultActiveTournamentsReturnValue: ReturnType<typeof useGetActiveTournaments> = {
  tournaments: [],
  isLoading: false,
  isError: false,
  refetch: mockRefetchActive,
  isRefetching: false,
};

const defaultPastTournamentsReturnValue: ReturnType<typeof useGetPastTournaments> = {
  tournaments: [],
  isLoading: false,
  isError: false,
  refetch: mockRefetchPast,
  isRefetching: false,
};

describe('ESport', () => {
  beforeEach(() => {
    useGetActiveTournamentsMock.mockReturnValue(defaultActiveTournamentsReturnValue);
    useGetPastTournamentsMock.mockReturnValue(defaultPastTournamentsReturnValue);
  });

  it('matches snapshot with tournaments', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      tournaments: [mockTournament1, mockTournament2, mockTournament3],
    });

    const { toJSON } = render(<ESport />);

    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
    expect(screen.getByText('Test Tournament 2')).toBeTruthy();
    expect(screen.getByText('Test Tournament 3')).toBeTruthy();

    const tree = toJSON();
    // Remove circular references for snapshot testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete tree.children[1].props.refreshControl;

    expect(tree).toMatchSnapshot();
  });

  it('shows spinner when loading', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      isLoading: true,
    });

    render(<ESport />);

    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error message when request fails', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      isError: true,
    });

    render(<ESport />);

    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('shows error message when tournament list is empty', () => {
    render(<ESport />);

    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('calls active tab onPress when active tab is pressed', () => {
    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      tournaments: [mockTournament1],
    });

    render(<ESport />);

    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Switch back to active tab
    const activeTab = screen.getByText('active');
    fireEvent.press(activeTab);

    // Verify active tab is now selected (disabled)
    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
  });

  it('calls past tab onPress when past tab is pressed', () => {
    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      tournaments: [mockTournament1],
    });

    render(<ESport />);

    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Verify past tab is now selected (disabled)
    expect(screen.getByText('past')).toBeDisabled();
    expect(screen.getByText('active')).toBeEnabled();
  });

  it('shows active tournaments when active tab is selected', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      tournaments: [mockTournament1, mockTournament2],
    });

    render(<ESport />);

    // Verify active tournaments are displayed
    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
    expect(screen.getByText('Test Tournament 2')).toBeTruthy();
  });

  it('shows past tournaments when past tab is selected', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      tournaments: [mockTournament1],
    });

    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      tournaments: [mockTournament3],
    });

    const { rerender } = render(<ESport />);

    // Initially shows active tournaments
    expect(screen.getByText('Test Tournament 1')).toBeTruthy();

    // Switch to past tab
    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Re-render to update the view
    rerender(<ESport />);

    // Verify past tournaments are displayed
    expect(screen.getByText('Test Tournament 3')).toBeTruthy();
  });

  it('shows loading state when past tab is loading', () => {
    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      isLoading: true,
    });

    render(<ESport />);

    // Switch to past tab
    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Verify spinner is shown
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error when past tab has error', () => {
    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      isError: true,
    });

    render(<ESport />);

    // Switch to past tab
    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Verify error message is shown
    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('shows error when past tab has empty tournaments', () => {
    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      tournaments: [],
    });

    render(<ESport />);

    // Switch to past tab
    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    // Verify error message is shown
    expect(screen.getByText('An error occurred while loading tournaments. Please try again later.')).toBeTruthy();
  });

  it('maintains separate state for each tab', () => {
    useGetActiveTournamentsMock.mockReturnValue({
      ...defaultActiveTournamentsReturnValue,
      tournaments: [mockTournament1],
    });

    useGetPastTournamentsMock.mockReturnValue({
      ...defaultPastTournamentsReturnValue,
      tournaments: [mockTournament3],
    });

    const { rerender } = render(<ESport />);

    // Verify active tab shows active tournament
    expect(screen.getByText('Test Tournament 1')).toBeTruthy();

    // Switch to past tab
    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);
    rerender(<ESport />);

    // Verify past tab shows past tournament
    expect(screen.getByText('Test Tournament 3')).toBeTruthy();

    // Switch back to active tab
    const activeTab = screen.getByText('active');
    fireEvent.press(activeTab);
    rerender(<ESport />);

    // Verify active tab still shows active tournament
    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
  });
});
