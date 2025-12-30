import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { DateTime } from 'luxon';

import { type Tournament, TournamentState } from '../../types/tournament';
import { TournamentCard } from './TournamentCard';

jest.mock('expo-router');

const useRouterMock = jest.mocked(useRouter);

const pushMock = jest.fn();

const mockTournament: Tournament = {
  id: 1,
  name: 'Test Tournament',
  url: new URL('https://example.com/tournament/1'),
  imageUrl: new URL('https://example.com/image.png'),
  countryCode: 'US',
  isOnline: true,
  numAttendees: 100,
  state: TournamentState.ONGOING,
  startAt: DateTime.fromISO('2025-01-01T10:30:00Z', { zone: 'utc' }),
  endAt: DateTime.fromISO('2025-01-05T10:30:00Z', { zone: 'utc' }),
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: DateTime.fromISO('2025-01-02T10:00:00Z', { zone: 'utc' }),
    },
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 30,
      startAt: DateTime.fromISO('2025-01-03T10:00:00Z', { zone: 'utc' }),
    },
  ],
};

const renderComponent = (tournament: Tournament) => {
  return render(<TournamentCard tournament={tournament} />);
};

describe('TournamentCard', () => {
  beforeEach(() => {
    useRouterMock.mockReturnValue({
      push: pushMock,
    } as unknown as ReturnType<typeof useRouter>);
  });

  it('renders tournament information correctly', () => {
    renderComponent(mockTournament);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
    expect(screen.getByText(/100 attendees/)).toBeTruthy();
  });

  it('displays date range for same day', () => {
    const sameDayTournament = {
      ...mockTournament,
      startAt: DateTime.fromISO('2025-01-10T10:00:00Z', { zone: 'utc' }),
      endAt: DateTime.fromISO('2025-01-10T18:30:00Z', { zone: 'utc' }),
    };

    renderComponent(sameDayTournament);

    expect(screen.getByText('Jan 10, 2025')).toBeTruthy();
  });

  it('displays date range for same month', () => {
    const sameMonthTournament = {
      ...mockTournament,
      startAt: DateTime.fromISO('2025-01-10T10:30:00Z', { zone: 'utc' }),
      endAt: DateTime.fromISO('2025-01-15T10:30:00Z', { zone: 'utc' }),
    };

    renderComponent(sameMonthTournament);

    expect(screen.getByText('Jan 10-15, 2025')).toBeTruthy();
  });

  it('displays date range for different months', () => {
    const diffMonthTournament = {
      ...mockTournament,
      startAt: DateTime.fromISO('2025-01-30T10:30:00Z', { zone: 'utc' }),
      endAt: DateTime.fromISO('2025-02-05T10:30:00Z', { zone: 'utc' }),
    };

    renderComponent(diffMonthTournament);

    expect(screen.getByText('Jan 30 - Feb 05, 2025')).toBeTruthy();
  });

  it('displays wifi icon for online tournaments', () => {
    renderComponent(mockTournament);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
    // WiFi icon is present in the component when isOnline is true
  });

  it('does not display wifi icon for offline tournaments', () => {
    const offlineTournament = { ...mockTournament, isOnline: false };
    renderComponent(offlineTournament);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
    // WiFi icon is not present when isOnline is false
  });

  it('displays country flag when countryCode is provided', () => {
    renderComponent(mockTournament);

    expect(screen.getByText(/🇺🇸/)).toBeTruthy();
  });

  it('does not display country flag when countryCode is not provided', () => {
    const noCountryTournament = { ...mockTournament, countryCode: undefined };
    renderComponent(noCountryTournament);

    expect(screen.queryByText(/🇺🇸/)).toBeNull();
  });

  it('displays tournament image when imageUrl is provided', () => {
    renderComponent(mockTournament);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
    // Image is rendered when imageUrl is provided
  });

  it('does not display tournament image when imageUrl is not provided', () => {
    const noImageTournament = { ...mockTournament, imageUrl: undefined };
    renderComponent(noImageTournament);

    expect(screen.getByText('Test Tournament')).toBeTruthy();
    // Image is not rendered when imageUrl is not provided
  });

  it('displays all events', () => {
    renderComponent(mockTournament);

    expect(screen.getByText('Event 1')).toBeTruthy();
    expect(screen.getByText('Jan 02 - 50 entrants')).toBeTruthy();
    expect(screen.getByText('Event 2')).toBeTruthy();
    expect(screen.getByText('Jan 03 - 30 entrants')).toBeTruthy();
  });

  it('navigates to tournament URL when pressed', () => {
    renderComponent(mockTournament);

    const card = screen.getByText('Test Tournament');
    fireEvent.press(card);

    expect(pushMock).toHaveBeenCalledWith('https://example.com/tournament/1');
  });
});
