import { useGetItems } from '@/hooks/data/useGetItems/useGetItems';
import { type Item } from '@/types/item';

import { useGetMyRotationalCoinStore } from '../../data/useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';

const sortItems = (items: Item[]) =>
  items.sort(
    (itemA, itemB) => (itemA.coinPrice ?? 0) - (itemB.coinPrice ?? 0) || itemA.category.localeCompare(itemB.category),
  );

export const useRotatingCoinShop = () => {
  const { rotationalCoinStore, isLoading: isLoadingRotation } = useGetMyRotationalCoinStore();
  const { items, isLoading: isLoadingItems } = useGetItems(rotationalCoinStore?.itemIds ?? []);

  return {
    items: sortItems(items),
    expirationDate: rotationalCoinStore?.expirationDate,
    isLoading: isLoadingRotation || isLoadingItems,
  };
};
