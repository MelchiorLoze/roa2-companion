import { Category, CurrencyId, ItemDto } from '@/types/store';

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
  } as ItemDto);
