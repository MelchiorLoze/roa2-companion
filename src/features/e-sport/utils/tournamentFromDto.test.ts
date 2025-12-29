import { DateTime } from 'luxon';

import { type TournamentDto, TournamentState } from '../types/tournament';
import { tournamentFromDto } from './tournamentFromDto';

describe('tournamentFromDto', () => {
  const mockTournamentDto: TournamentDto = {
    id: 1,
    name: 'Test Tournament',
    url: 'https://example.com/tournament/1',
    imageUrl: 'https://example.com/image.png',
    countryCode: 'US',
    isOnline: true,
    numAttendees: 100,
    state: 'ONGOING',
    startAt: '2025-01-01T00:00:00Z',
    endAt: '2025-01-05T23:59:59Z',
    events: [
      {
        id: 1,
        name: 'Event 1',
        numEntrants: 50,
        startAt: '2025-01-02T10:00:00Z',
      },
    ],
  };

  it('converts DTO to Tournament correctly', () => {
    const tournament = tournamentFromDto(mockTournamentDto);

    expect(tournament.id).toBe(1);
    expect(tournament.name).toBe('Test Tournament');
    expect(tournament.url).toEqual(new URL('https://example.com/tournament/1'));
    expect(tournament.imageUrl).toEqual(new URL('https://example.com/image.png'));
    expect(tournament.countryCode).toBe('US');
    expect(tournament.isOnline).toBe(true);
    expect(tournament.numAttendees).toBe(100);
    expect(tournament.state).toBe(TournamentState.ONGOING);
  });

  it('converts startAt and endAt to DateTime objects in UTC', () => {
    const tournament = tournamentFromDto(mockTournamentDto);

    expect(tournament.startAt).toBeInstanceOf(DateTime);
    expect(tournament.endAt).toBeInstanceOf(DateTime);
    expect(tournament.startAt.zoneName).toBe('UTC');
    expect(tournament.endAt.zoneName).toBe('UTC');
    expect(tournament.startAt.toISO()).toBe('2025-01-01T00:00:00.000Z');
    expect(tournament.endAt.toISO()).toBe('2025-01-05T23:59:59.000Z');
  });

  it('converts event startAt to DateTime objects in UTC', () => {
    const tournament = tournamentFromDto(mockTournamentDto);

    expect(tournament.events[0].startAt).toBeInstanceOf(DateTime);
    expect(tournament.events[0].startAt.zoneName).toBe('UTC');
    expect(tournament.events[0].startAt.toISO()).toBe('2025-01-02T10:00:00.000Z');
  });

  it('handles null imageUrl', () => {
    const dtoWithoutImage: TournamentDto = {
      ...mockTournamentDto,
      imageUrl: null,
    };

    const tournament = tournamentFromDto(dtoWithoutImage);

    expect(tournament.imageUrl).toBeUndefined();
  });

  it('handles null countryCode', () => {
    const dtoWithoutCountry: TournamentDto = {
      ...mockTournamentDto,
      countryCode: null,
    };

    const tournament = tournamentFromDto(dtoWithoutCountry);

    expect(tournament.countryCode).toBeUndefined();
  });

  it('sorts events by numEntrants in descending order', () => {
    const dtoWithMultipleEvents: TournamentDto = {
      ...mockTournamentDto,
      events: [
        {
          id: 1,
          name: 'Event 1',
          numEntrants: 30,
          startAt: '2025-01-02T10:00:00Z',
        },
        {
          id: 2,
          name: 'Event 2',
          numEntrants: 50,
          startAt: '2025-01-03T10:00:00Z',
        },
        {
          id: 3,
          name: 'Event 3',
          numEntrants: 40,
          startAt: '2025-01-04T10:00:00Z',
        },
      ],
    };

    const tournament = tournamentFromDto(dtoWithMultipleEvents);

    expect(tournament.events).toHaveLength(3);
    expect(tournament.events[0].numEntrants).toBe(50);
    expect(tournament.events[1].numEntrants).toBe(40);
    expect(tournament.events[2].numEntrants).toBe(30);
  });

  it('handles UPCOMING state', () => {
    const upcomingDto: TournamentDto = {
      ...mockTournamentDto,
      state: 'UPCOMING',
    };

    const tournament = tournamentFromDto(upcomingDto);

    expect(tournament.state).toBe(TournamentState.UPCOMING);
  });

  it('handles COMPLETED state', () => {
    const completedDto: TournamentDto = {
      ...mockTournamentDto,
      state: 'COMPLETED',
    };

    const tournament = tournamentFromDto(completedDto);

    expect(tournament.state).toBe(TournamentState.COMPLETED);
  });
});
