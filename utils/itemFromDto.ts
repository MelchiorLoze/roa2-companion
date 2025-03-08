import { CurrencyId, Item, ItemDto, Rarity, RarityValue } from '@/types/store';

const getPriceValueFromItemDto = (item: ItemDto, currencyId: CurrencyId) => {
  return item.PriceOptions.Prices.find((price) => price.Amounts[0].ItemId === currencyId)?.Amounts[0].Amount;
};

const rarityFromValue = (rarityValue: RarityValue) => {
  switch (rarityValue) {
    case RarityValue.COMMON:
      return Rarity.COMMON;
    case RarityValue.RARE:
      return Rarity.RARE;
    case RarityValue.EPIC:
      return Rarity.EPIC;
    case RarityValue.LEGENDARY:
      return Rarity.LEGENDARY;
  }
};

export const itemFromDto = (item: ItemDto) =>
  ({
    id: item.Id,
    title: item.Title.NEUTRAL,
    category: item.ContentType,
    buckPrice: getPriceValueFromItemDto(item, CurrencyId.BUCKS),
    coinPrice: getPriceValueFromItemDto(item, CurrencyId.COINS),
    rarity: rarityFromValue(item.DisplayProperties.rarity),
  } as Item);
