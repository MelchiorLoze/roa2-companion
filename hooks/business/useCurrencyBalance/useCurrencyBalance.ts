import { useGetInventoryItems } from '@/hooks/data';
import { CurrencyId, InventoryItem } from '@/types/store';

const getCurrencyBalance = (currencyId: CurrencyId, items?: InventoryItem[]) => {
  return items?.find((item) => item.id === currencyId)?.amount;
};

export const useCurrencyBalance = () => {
  const { inventoryItems, isLoading, isError } = useGetInventoryItems();

  const coinsBalance = getCurrencyBalance(CurrencyId.COINS, inventoryItems);
  const bucksBalance = getCurrencyBalance(CurrencyId.BUCKS, inventoryItems);

  return { coinsBalance, bucksBalance, isLoading, isError };
};
