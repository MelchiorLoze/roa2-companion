import { Category, Rarity } from '@/types/item';

import type { StoreItem } from '../types/item';

export const testItemList: StoreItem[] = [
  {
    id: '1',
    name: 'Item 1',
    rarity: Rarity.COMMON,
    category: Category.ICON,
    coinPrice: 2000,
    buckPrice: 20,
  },
  {
    id: '2',
    name: 'Item 2',
    rarity: Rarity.EPIC,
    category: Category.DEATHEFFECT,
    buckPrice: 500,
  },
  {
    id: '3',
    name: 'Item 3',
    rarity: Rarity.RARE,
    category: Category.EMOTE,
    coinPrice: 1500,
  },
  {
    id: '4',
    name: 'Item 4',
    rarity: Rarity.LEGENDARY,
    category: Category.SKIN,
  },
  {
    id: '5',
    name: 'Item 5',
    rarity: Rarity.COMMON,
    category: Category.STAGESKIN,
    coinPrice: 200000,
    buckPrice: 2000,
  },
];
