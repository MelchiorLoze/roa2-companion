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

const mockTournament2: Tournament = {
  id: 2,
  name: 'Test Tournament 2',
  url: new URL('https://example.com/tournament/2'),
  imageUrl: new URL('https://example.com/image2.png'),
  countryCode: 'CA',
  isOnline: false,
  numAttendees: 200,
  state: TournamentState.UPCOMING,
  startAt: DateTime.fromISO('2025-02-01T00:00:00Z'),
  endAt: DateTime.fromISO('2025-02-05T23:59:59Z'),
  events: [
    {
      id: 2,
      name: 'Event 2',
      numEntrants: 100,
      startAt: DateTime.fromISO('2025-02-02T10:00:00Z'),
    },
  ],
};

const refreshControl = <RefreshControl onRefresh={jest.fn()} refreshing={false} />;

const renderComponent = (tournaments: Tournament[]) => {
  return render(<TournamentList refreshControl={refreshControl} tournaments={tournaments} />);
};

describe('TournamentList', () => {
  it('renders empty list correctly', () => {
    const tree = renderComponent([]).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders single tournament correctly', () => {
    renderComponent([mockTournament1]);

    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
  });

  it('renders multiple tournaments correctly', () => {
    renderComponent([mockTournament1, mockTournament2]);

    expect(screen.getByText('Test Tournament 1')).toBeTruthy();
    expect(screen.getByText('Test Tournament 2')).toBeTruthy();
  });
});
