import { CurrencyId } from '@/types/currency';
import { RARITY_VALUES_MAPPING } from '@/types/item';

import type { StoreItem, StoreItemDto } from '../types/item';

const getPriceValueFromItemDto = (item: StoreItemDto, currencyId: CurrencyId) => {
  return item.PriceOptions?.Prices.find((price) => price.Amounts[0].ItemId === currencyId)?.Amounts[0].Amount;
};

export const itemFromDto = (item: StoreItemDto) =>
  ({
    id: item.Id,
    name: item.Title.NEUTRAL,
    category: item.ContentType,
    coinPrice: getPriceValueFromItemDto(item, CurrencyId.COINS),
    buckPrice: getPriceValueFromItemDto(item, CurrencyId.BUCKS),
    rarity: RARITY_VALUES_MAPPING[item.DisplayProperties.rarity],
  }) as StoreItem;
