import type { Item } from '@/types/item';

export type CoinStoreItem = Item & Required<Pick<Item, 'coinPrice'>>;
