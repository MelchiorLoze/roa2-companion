import { DateTime } from 'luxon';

import { type Tournament, type TournamentDto, type TournamentState } from '../types/tournament';

export const tournamentFromDto = (dto: TournamentDto): Tournament => {
  return {
    ...dto,
    imageUrl: dto.imageUrl ? new URL(dto.imageUrl) : undefined,
    countryCode: dto.countryCode ?? undefined,
    state: dto.state as TournamentState,
    startAt: DateTime.fromISO(dto.startAt, { zone: 'utc' }),
    endAt: DateTime.fromISO(dto.endAt, { zone: 'utc' }),
    events: dto.events.map((event) => ({
      ...event,
      startAt: DateTime.fromISO(event.startAt, { zone: 'utc' }),
    })),
  };
};
