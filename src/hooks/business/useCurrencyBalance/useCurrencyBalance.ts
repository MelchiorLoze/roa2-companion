import { useGetInventoryItems } from '@/hooks/data/useGetInventoryItems/useGetInventoryItems';
import { CurrencyId } from '@/types/currency';
import { type Item } from '@/types/item';

const getCurrencyBalance = (
  currencyId: Item['id'],
  items: ReturnType<typeof useGetInventoryItems>['inventoryItems'],
) => {
  return items?.find((item) => item.id === currencyId)?.amount ?? 0;
};

export const useCurrencyBalance = () => {
  const { inventoryItems, isLoading, isError } = useGetInventoryItems();

  const coinsBalance = getCurrencyBalance(CurrencyId.COINS, inventoryItems);
  const bucksBalance = getCurrencyBalance(CurrencyId.BUCKS, inventoryItems);
  const medalsBalance = getCurrencyBalance(CurrencyId.MEDALS, inventoryItems);

  return { coinsBalance, bucksBalance, medalsBalance, isLoading, isError };
};
