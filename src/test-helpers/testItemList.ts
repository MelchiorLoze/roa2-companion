import { Category, type Item, Rarity } from '@/types/item';

export const testItemList: Item[] = [
  {
    id: '1',
    friendlyId: 'Icon_item_1',
    name: 'Item 1',
    rarity: Rarity.COMMON,
    category: Category.ICON,
    coinPrice: 2000,
    buckPrice: 20,
  },
  {
    id: '2',
    friendlyId: 'DeathEffect_item_2',
    name: 'Item 2',
    rarity: Rarity.EPIC,
    category: Category.DEATHEFFECT,
    buckPrice: 500,
  },
  {
    id: '3',
    friendlyId: 'Emote_item_3',
    name: 'Item 3',
    rarity: Rarity.RARE,
    category: Category.EMOTE,
    coinPrice: 1500,
  },
  {
    id: '4',
    friendlyId: 'Skin_item_4',
    name: 'Item 4',
    rarity: Rarity.LEGENDARY,
    category: Category.SKIN,
  },
  {
    id: '5',
    friendlyId: 'StageSkin_item_5',
    name: 'Item 5',
    rarity: Rarity.COMMON,
    category: Category.STAGESKIN,
    coinPrice: 200000,
    buckPrice: 2000,
  },
];
