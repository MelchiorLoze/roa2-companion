import type { DateTime } from 'luxon';

export enum CurrencyId {
  COINS = 'b3f4a8f0-dd58-4e3f-ae0a-7a17418fc903',
  BUCKS = 'ed4812be-4dcd-446b-b61e-96d8be8f6121',
}

export enum Currency {
  COINS = 'coins',
  BUCKS = 'bucks',
}

export type Category = 'deatheffect' | 'emote' | 'icon' | 'palette' | 'platform' | 'skin';

export type RotationalCoinStore = {
  expirationDate: DateTime;
  itemIds: Item['id'][];
};

export type ItemDto = {
  Id: string;
  Title: { NEUTRAL: string };
  ContentType: Category;
  PriceOptions: {
    Prices: {
      Amounts: {
        ItemId: CurrencyId;
        Amount: number;
      }[];
    }[];
  };
};

export type Item = {
  id: string;
  title: string;
  category: Category;
  buckPrice?: number;
  coinPrice?: number;
};

export type InventoryItem = {
  id: Item['id'];
  amount: number;
};
