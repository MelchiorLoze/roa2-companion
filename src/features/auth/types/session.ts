import { type DateTime } from 'luxon';

export type Session = {
  entityToken: string;
  expirationDate: DateTime;
};
