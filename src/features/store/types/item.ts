import type { CurrencyId } from '@/types/currency';
import type { Category, Item, RarityValue } from '@/types/item';

export type StoreItemDto = {
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

export type StoreItem = Item & {
  coinPrice?: number;
  buckPrice?: number;
};

export type CoinStoreItem = StoreItem & Required<Pick<StoreItem, 'coinPrice'>>;
