import type { DateTime } from 'luxon';

import { BucksIcon, CoinsIcon, CommonIcon, EpicIcon, LegendaryIcon, MedalsIcon, RareIcon } from '@/assets/images';
import { ImageSource } from 'expo-image';

// CURRENCIES

export enum CurrencyId {
  COINS = 'b3f4a8f0-dd58-4e3f-ae0a-7a17418fc903',
  BUCKS = 'ed4812be-4dcd-446b-b61e-96d8be8f6121',
  MEDALS = 'daf33d00-75b5-4b0e-8cbc-8219b9dcb7ca',
}

export enum Currency {
  COINS = 'coins',
  BUCKS = 'bucks',
  MEDALS = 'medals',
}

export const CURRENCY_ICONS: Readonly<Record<Currency, ImageSource>> = Object.freeze({
  [Currency.COINS]: CoinsIcon,
  [Currency.BUCKS]: BucksIcon,
  [Currency.MEDALS]: MedalsIcon,
});

// RARITIES

export enum RarityValue {
  COMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
}

export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export const RARITY_ICONS: Readonly<Record<Rarity, ImageSource>> = Object.freeze({
  [Rarity.COMMON]: CommonIcon,
  [Rarity.RARE]: RareIcon,
  [Rarity.EPIC]: EpicIcon,
  [Rarity.LEGENDARY]: LegendaryIcon,
});

// ITEMS

export enum Category {
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
  PriceOptions: {
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
  buckPrice?: number;
  coinPrice?: number;
};

export type InventoryItem = {
  id: Item['id'];
  amount: number;
};

export type RotationalCoinStore = {
  expirationDate: DateTime;
  itemIds: Item['id'][];
};
