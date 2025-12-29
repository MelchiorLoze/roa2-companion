import { DateTime } from 'luxon';

import { type Tournament, type TournamentDto } from '../types/tournament';

export const tournamentFromDto = (dto: TournamentDto): Tournament => {
  return {
    ...dto,
    url: new URL(dto.url),
    imageUrl: dto.imageUrl ? new URL(dto.imageUrl) : undefined,
    countryCode: dto.countryCode ?? undefined,
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
