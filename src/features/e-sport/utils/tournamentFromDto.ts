import { DateTime } from 'luxon';

import { type Tournament, type TournamentDto, type TournamentState } from '../types/tournament';

const START_GG_BASE_URL = 'https://www.start.gg';

export const tournamentFromDto = (dto: TournamentDto): Tournament => {
  return {
    ...dto,
    url: new URL(dto.slug, START_GG_BASE_URL),
    imageUrl: dto.imageUrl ? new URL(dto.imageUrl) : undefined,
    countryCode: dto.countryCode ?? undefined,
    state: dto.state as TournamentState,
    startAt: DateTime.fromISO(dto.startAt, { zone: 'utc' }),
    endAt: DateTime.fromISO(dto.endAt, { zone: 'utc' }),
    events: dto.events
      .map((event) => ({
        ...event,
        startAt: DateTime.fromISO(event.startAt, { zone: 'utc' }),
      }))
      .sort((a, b) => b.numEntrants - a.numEntrants),
  };
};
