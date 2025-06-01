import { CurrencyId } from '@/types/currency';
import type { Category } from '@/types/item';

import type { StoreItemDto } from '../types/item';

export const createItemDto = (id: string, category: Category, buckPrice: number) =>
  ({
    Id: id,
    Title: { NEUTRAL: `Item ${id}` },
    ContentType: category,
    PriceOptions: {
      Prices: [
        {
          Amounts: [{ ItemId: CurrencyId.BUCKS, Amount: buckPrice }],
        },
        {
          Amounts: [{ ItemId: CurrencyId.COINS, Amount: buckPrice * 100 }],
        },
      ],
    },
    DisplayProperties: {
      rarity: 1,
    },
  }) as StoreItemDto;
