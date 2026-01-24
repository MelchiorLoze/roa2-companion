import { useGetInventoryItems } from '@/hooks/data/useGetInventoryItems/useGetInventoryItems';
import { CurrencyId } from '@/types/currency';
import { type Item } from '@/types/item';
import { type LoadableState } from '@/types/loadableState';

const getCurrencyBalance = (
  currencyId: Item['id'],
  items: NonNullable<ReturnType<typeof useGetInventoryItems>['inventoryItems']>,
) => {
  return items.find((item) => item.id === currencyId)?.amount ?? 0;
};

type CurrencyBalanceState = LoadableState<{
  coinsBalance: number;
  bucksBalance: number;
  medalsBalance: number;
}>;

export const useCurrencyBalance = (): CurrencyBalanceState => {
  const { inventoryItems, isLoading } = useGetInventoryItems();

  const baseState = {
    coinsBalance: undefined,
    bucksBalance: undefined,
    medalsBalance: undefined,
    isLoading: false,
    isError: false,
  } as const;

  if (inventoryItems) {
    return {
      ...baseState,
      coinsBalance: getCurrencyBalance(CurrencyId.COINS, inventoryItems),
      bucksBalance: getCurrencyBalance(CurrencyId.BUCKS, inventoryItems),
      medalsBalance: getCurrencyBalance(CurrencyId.MEDALS, inventoryItems),
    } as const;
  }

  if (isLoading) {
    return {
      ...baseState,
      isLoading: true,
    } as const;
  }

  return {
    ...baseState,
    isError: true,
  } as const;
};
