import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients';
import { invalidateGetInventoryItems } from '@/hooks/data';
import { CurrencyId } from '@/types/currency';

import type { StoreItem } from '../../../types/item';
import { invalidateGetMyRotationalCoinStore } from '../useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';

type ItemToPurchase = {
  id: StoreItem['id'];
  price: { value: number; currencyId: CurrencyId };
};

type Props = { onSuccess?: () => void };

export const usePurchaseInventoryItems = ({ onSuccess }: Props = {}) => {
  const apiClient = useGameApiClient();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (item: ItemToPurchase) =>
      apiClient.post<void>('/Inventory/PurchaseInventoryItems', {
        body: {
          Amount: 1,
          DeleteEmptyStacks: false,
          Item: {
            Id: item.id,
          },
          PriceAmounts: [
            {
              Amount: item.price.value,
              ItemId: item.price.currencyId,
            },
          ],
        },
      }),
    onSuccess: (_, item) => {
      invalidateGetInventoryItems(queryClient);
      if (item.price.currencyId === CurrencyId.COINS) invalidateGetMyRotationalCoinStore(queryClient);
      onSuccess?.();
    },
  });

  return { purchase: mutate, isLoading: isPending, isError };
};
