import type { ImageSource } from 'expo-image';

import { CommonIcon, EpicIcon, LegendaryIcon, RareIcon } from '../assets';

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
