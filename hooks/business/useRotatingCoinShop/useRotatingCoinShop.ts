import { useGetItems, useGetMyRotationalCoinStore } from '@/hooks/data';
import { Item } from '@/types/store';

const sortItems = (items: Item[]) =>
  items.sort(
    (itemA, itemB) => (itemA.coinPrice ?? 0) - (itemB.coinPrice ?? 0) || itemA.category.localeCompare(itemB.category),
  );

export const useRotatingCoinShop = () => {
  const { rotationalCoinStore, isLoading: isRotationalCoinStoreLoading } = useGetMyRotationalCoinStore();
  const { items, isLoading: isGetItemsLoading } = useGetItems(rotationalCoinStore?.itemIds ?? []);

  return {
    items: sortItems(items),
    expirationDate: rotationalCoinStore?.expirationDate,
    isLoading: isRotationalCoinStoreLoading || isGetItemsLoading,
  };
};
