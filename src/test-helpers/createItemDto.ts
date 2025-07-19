import { CurrencyId } from '@/types/currency';
import { type Category, type ItemDto } from '@/types/item';

export const createItemDto = (id: string, category: Category, buckPrice: number) =>
  ({
    Id: id,
    FriendlyId: `${category}_item_${id}`,
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
  }) as ItemDto;
