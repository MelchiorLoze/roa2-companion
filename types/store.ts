import type { DateTime } from 'luxon';

export type RotationalCoinStore = {
  expirationDate: DateTime;
  itemIds: string[];
};
