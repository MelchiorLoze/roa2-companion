import { type DateTime } from 'luxon';

import { useGetItems } from '@/hooks/data/useGetItems/useGetItems';
import { type Item } from '@/types/item';
import { type LoadableState } from '@/types/loadableState';

import { useGetMyRotationalCoinStore } from '../../data/useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';

type RotatingCoinShop = LoadableState<{
  items: Item[];
  expirationDate: DateTime;
}>;

const sortItems = (items: Item[]): Item[] =>
  items.sort(
    (itemA, itemB) => (itemA.coinPrice ?? 0) - (itemB.coinPrice ?? 0) || itemA.category.localeCompare(itemB.category),
  );

export const useRotatingCoinShop = (): RotatingCoinShop => {
  const { rotationalCoinStore, isLoading: isLoadingRotation } = useGetMyRotationalCoinStore();
  const { items, isLoading: isLoadingItems } = useGetItems(rotationalCoinStore?.itemIds ?? []);

  const baseState = {
    items: undefined,
    expirationDate: undefined,
    isLoading: false,
    isError: false,
  } as const;

  if (rotationalCoinStore && items?.length) {
    return {
      ...baseState,
      items: sortItems(items),
      expirationDate: rotationalCoinStore.expirationDate,
    } as const;
  }

  if (isLoadingRotation || isLoadingItems) {
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
