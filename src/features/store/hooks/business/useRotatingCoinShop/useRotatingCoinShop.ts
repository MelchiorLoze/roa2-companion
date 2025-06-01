import type { Item } from '../../../types/item';
import { useGetItems } from '../../data/useGetItems/useGetItems';
import { useGetMyRotationalCoinStore } from '../../data/useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';

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
