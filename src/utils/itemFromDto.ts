import { CurrencyId } from '@/types/currency';
import { type Item, type ItemDto, RARITY_VALUES_MAPPING } from '@/types/item';

import { imageUrlFromFriendlyId } from './imageUrlFromFriendlyId';

const getPriceValueFromItemDto = (item: ItemDto, currencyId: CurrencyId) => {
  return item.PriceOptions?.Prices.find((price) => price.Amounts[0].ItemId === currencyId)?.Amounts[0].Amount;
};

export const itemFromDto = (item: ItemDto): Item => ({
  id: item.Id,
  imageUrl: imageUrlFromFriendlyId(item.ContentType, item.FriendlyId),
  name: item.Title.NEUTRAL,
  category: item.ContentType,
  coinPrice: getPriceValueFromItemDto(item, CurrencyId.COINS),
  buckPrice: getPriceValueFromItemDto(item, CurrencyId.BUCKS),
  rarity: RARITY_VALUES_MAPPING[item.DisplayProperties.rarity],
});
