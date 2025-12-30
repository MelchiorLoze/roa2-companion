import { render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import { RefreshControl } from 'react-native';

import { type Tournament, TournamentState } from '../../types/tournament';
import { TournamentList } from './TournamentList';

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

const refreshControl = <RefreshControl onRefresh={jest.fn()} refreshing={false} />;

const renderComponent = (tournaments: Tournament[]) => {
  return render(<TournamentList refreshControl={refreshControl} tournaments={tournaments} />);
};

describe('TournamentList', () => {
  it('renders empty list correctly', () => {
    renderComponent([]);

    expect(screen.queryByText(/Test Tournament/)).toBeNull();
  });

  it('renders single tournament correctly', () => {
    renderComponent([mockTournament1]);

    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
  });

  it('renders multiple tournaments correctly', () => {
    renderComponent([mockTournament1, mockTournament2, mockTournament3]);

    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
    expect(screen.getByText('Test Tournament 2')).toBeTruthy();
    expect(screen.getByText('Test Tournament 3')).toBeTruthy();
  });
});
