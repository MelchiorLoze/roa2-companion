import type { DateTime } from 'luxon';

import type { CurrencyId } from '@/types/currency';

import type { Rarity, RarityValue } from './rarity';

export const enum Category {
  DEATHEFFECT = 'deatheffect',
  EMOTE = 'emote',
  ICON = 'icon',
  PALETTE = 'palette',
  PLATFORM = 'platform',
  SKIN = 'skin',
  STAGESKIN = 'stageskin',
  TAUNT = 'taunt',
}

export const CATEGORY_LABELS: Readonly<Record<Category, string>> = Object.freeze({
  [Category.DEATHEFFECT]: 'DEATH',
  [Category.EMOTE]: 'EMOTE',
  [Category.ICON]: 'ICON',
  [Category.PALETTE]: 'PALETTE',
  [Category.PLATFORM]: 'PLATFORM',
  [Category.SKIN]: 'SKIN',
  [Category.STAGESKIN]: 'STAGE SKIN',
  [Category.TAUNT]: 'TAUNT',
});

export type ItemDto = {
  Id: string;
  Title: { NEUTRAL: string };
  ContentType: Category;
  PriceOptions?: {
    Prices: {
      Amounts: {
        ItemId: CurrencyId;
        Amount: number;
      }[];
    }[];
  };
  DisplayProperties: {
    rarity: RarityValue;
  };
};

export type Item = {
  id: string;
  title: string;
  category: Category;
  rarity: Rarity;
  coinPrice?: number;
  buckPrice?: number;
};

export type RotationalCoinStore = {
  expirationDate: DateTime;
  itemIds: Item['id'][];
};
