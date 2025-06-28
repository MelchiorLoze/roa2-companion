import { type ImageSource } from 'expo-image';

import { CommonIcon, EpicIcon, LegendaryIcon, RareIcon } from '@/assets/images/rarity';

import { type CurrencyId } from './currency';

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
  [Category.DEATHEFFECT]: 'death',
  [Category.EMOTE]: 'emote',
  [Category.ICON]: 'icon',
  [Category.PALETTE]: 'palette',
  [Category.PLATFORM]: 'platform',
  [Category.SKIN]: 'skin',
  [Category.STAGESKIN]: 'stage skin',
  [Category.TAUNT]: 'taunt',
});

export const enum RarityValue {
  COMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
}

export const enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export const RARITY_VALUES_MAPPING: Readonly<Record<RarityValue, Rarity>> = Object.freeze({
  [RarityValue.COMMON]: Rarity.COMMON,
  [RarityValue.RARE]: Rarity.RARE,
  [RarityValue.EPIC]: Rarity.EPIC,
  [RarityValue.LEGENDARY]: Rarity.LEGENDARY,
});

export const RARITY_ICONS: Readonly<Record<Rarity, ImageSource>> = Object.freeze({
  [Rarity.COMMON]: CommonIcon,
  [Rarity.RARE]: RareIcon,
  [Rarity.EPIC]: EpicIcon,
  [Rarity.LEGENDARY]: LegendaryIcon,
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
  name: string;
  category: Category;
  rarity: Rarity;
  coinPrice?: number;
  buckPrice?: number;
};
