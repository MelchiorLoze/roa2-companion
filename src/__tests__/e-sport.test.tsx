import { fireEvent, render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import ESport from '@/app/(private)/e-sport';
import { useTournamentsTab } from '@/features/e-sport/hooks/business/useTournamentsTab/useTournamentsTab';
import { type Tournament, TournamentState } from '@/features/e-sport/types/tournament';

jest.mock('@/features/e-sport/hooks/business/useTournamentsTab/useTournamentsTab');

const useTournamentsTabMock = jest.mocked(useTournamentsTab);

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

const defaultTournamentsTabReturnValue: ReturnType<typeof useTournamentsTab> = {
  tournaments: [],
  isLoading: false,
  isRefreshing: false,
  isError: false,
  selectedTab: 'active',
  selectActiveTab: jest.fn(),
  selectPastTab: jest.fn(),
  refresh: jest.fn(),
};

describe('ESport', () => {
  beforeEach(() => {
    useTournamentsTabMock.mockReturnValue(defaultTournamentsTabReturnValue);
  });

  it('matches snapshot with tournaments', () => {
    useTournamentsTabMock.mockReturnValue({
      ...defaultTournamentsTabReturnValue,
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
    useTournamentsTabMock.mockReturnValue({
      ...defaultTournamentsTabReturnValue,
      isLoading: true,
    });

    render(<ESport />);

    expect(screen.getByText('active')).toBeDisabled();
    expect(screen.getByText('past')).toBeEnabled();
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error message when request fails', () => {
    useTournamentsTabMock.mockReturnValue({
      ...defaultTournamentsTabReturnValue,
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

  it('calls selectActiveTab when active tab is pressed', () => {
    const selectActiveTabMock = jest.fn();
    useTournamentsTabMock.mockReturnValue({
      ...defaultTournamentsTabReturnValue,
      selectedTab: 'past',
      selectActiveTab: selectActiveTabMock,
    });

    render(<ESport />);

    const activeTab = screen.getByText('active');
    fireEvent.press(activeTab);

    expect(selectActiveTabMock).toHaveBeenCalledTimes(1);
  });

  it('calls selectPastTab when past tab is pressed', () => {
    const selectPastTabMock = jest.fn();
    useTournamentsTabMock.mockReturnValue({
      ...defaultTournamentsTabReturnValue,
      selectPastTab: selectPastTabMock,
    });

    render(<ESport />);

    const pastTab = screen.getByText('past');
    fireEvent.press(pastTab);

    expect(selectPastTabMock).toHaveBeenCalledTimes(1);
  });
});
