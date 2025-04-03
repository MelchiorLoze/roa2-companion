import { useGetInventoryItems } from '@/hooks/data';
import { CurrencyId, InventoryItem } from '@/types/store';

const getCurrencyBalance = (currencyId: CurrencyId, items: InventoryItem[]) => {
  return items?.find((item) => item.id === currencyId)?.amount ?? 0;
};

export const useCurrencyBalance = () => {
  const { inventoryItems, isLoading, isError } = useGetInventoryItems();

  const coinsBalance = getCurrencyBalance(CurrencyId.COINS, inventoryItems);
  const bucksBalance = getCurrencyBalance(CurrencyId.BUCKS, inventoryItems);
  const medalsBalance = getCurrencyBalance(CurrencyId.MEDALS, inventoryItems);

  return { coinsBalance, bucksBalance, medalsBalance, isLoading, isError };
};
