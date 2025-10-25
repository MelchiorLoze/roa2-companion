import { Category, type Item, Rarity } from '@/types/item';

export const testItemList: Item[] = [
  {
    id: '1',
    imageUrl: new URL('https://www.example.com/icon/Icon_item_1.png'),
    name: 'Item 1',
    rarity: Rarity.COMMON,
    category: Category.ICON,
    coinPrice: 2000,
    buckPrice: 20,
  },
  {
    id: '2',
    imageUrl: new URL('https://www.example.com/deatheffect/Deatheffect_item_2.png'),
    name: 'Item 2',
    rarity: Rarity.EPIC,
    category: Category.DEATHEFFECT,
    buckPrice: 500,
  },
  {
    id: '3',
    imageUrl: new URL('https://www.example.com/emote/Emote_item_3.png'),
    name: 'Item 3',
    rarity: Rarity.RARE,
    category: Category.EMOTE,
    coinPrice: 1500,
  },
  {
    id: '4',
    imageUrl: new URL('https://www.example.com/skin/Skin_item_4.png'),
    name: 'Item 4',
    rarity: Rarity.LEGENDARY,
    category: Category.SKIN,
  },
  {
    id: '5',
    imageUrl: new URL('https://www.example.com/stageskin/StageSkin_item_5.png'),
    name: 'Item 5',
    rarity: Rarity.COMMON,
    category: Category.STAGESKIN,
    coinPrice: 200000,
    buckPrice: 2000,
  },
];
