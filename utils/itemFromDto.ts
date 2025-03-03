import { CurrencyId, Item, ItemDto } from '@/types/store';

const getPriceValueFromItemDto = (item: ItemDto, currencyId: CurrencyId) => {
  return item.PriceOptions.Prices.find((price) => price.Amounts[0].ItemId === currencyId)?.Amounts[0].Amount;
};

export const itemFromDto = (item: ItemDto) =>
  ({
    id: item.Id,
    title: item.Title.NEUTRAL,
    category: item.ContentType,
    buckPrice: getPriceValueFromItemDto(item, CurrencyId.BUCKS),
    coinPrice: getPriceValueFromItemDto(item, CurrencyId.COINS),
  } as Item);
