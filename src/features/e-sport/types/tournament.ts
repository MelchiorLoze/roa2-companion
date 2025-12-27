import { type DateTime } from 'luxon';

export type TournamentDto = Readonly<{
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  countryCode: string | null;
  isOnline: boolean;
  numAttendees: number;
  state: string;
  startAt: string;
  endAt: string;
  events: EventDto[];
}>;

type EventDto = Readonly<{
  id: number;
  name: string;
  numEntrants: number;
  startAt: string;
}>;

export type Tournament = Readonly<{
  id: number;
  name: string;
  url: URL;
  imageUrl?: URL;
  countryCode?: string;
  isOnline: boolean;
  numAttendees: number;
  state: TournamentState;
  startAt: DateTime;
  endAt: DateTime;
  events: Event[];
}>;

export type Event = Readonly<{
  id: number;
  name: string;
  numEntrants: number;
  startAt: DateTime;
}>;

export enum TournamentState {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}
