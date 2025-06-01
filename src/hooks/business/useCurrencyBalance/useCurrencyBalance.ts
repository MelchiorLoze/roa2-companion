import { useGetInventoryItems } from '@/hooks/data';
import type { InventoryItem } from '@/types/currency';
import { CurrencyId } from '@/types/currency';

const getCurrencyBalance = (currencyId: InventoryItem['id'], items: InventoryItem[]) => {
  return items?.find((item) => item.id === currencyId)?.amount ?? 0;
};

export const useCurrencyBalance = () => {
  const { inventoryItems, isLoading, isError } = useGetInventoryItems();

  const coinsBalance = getCurrencyBalance(CurrencyId.COINS, inventoryItems);
  const bucksBalance = getCurrencyBalance(CurrencyId.BUCKS, inventoryItems);
  const medalsBalance = getCurrencyBalance(CurrencyId.MEDALS, inventoryItems);

  return { coinsBalance, bucksBalance, medalsBalance, isLoading, isError };
};
