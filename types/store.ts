import type { DateTime } from 'luxon';

export enum CurrencyId {
  COINS = 'b3f4a8f0-dd58-4e3f-ae0a-7a17418fc903',
  BUCKS = 'ed4812be-4dcd-446b-b61e-96d8be8f6121',
}

export type Category = 'icon' | 'palette' | 'skin' | 'emote' | 'deatheffect';

export type RotationalCoinStore = {
  expirationDate: DateTime;
  itemIds: string[];
};

export type Item = {
  id: string;
  title: string;
  category: Category;
  buckPrice?: number;
  coinPrice?: number;
};

export type InventoryItem = {
  id: string;
  amount: number;
};
