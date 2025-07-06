import { type DateTime } from 'luxon';

export type Session = Readonly<{
  entityToken: string;
  expirationDate: DateTime;
}>;
