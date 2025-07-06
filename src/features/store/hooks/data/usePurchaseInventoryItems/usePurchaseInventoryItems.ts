import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { invalidateGetInventoryItems } from '@/hooks/data/useGetInventoryItems/useGetInventoryItems';
import { CurrencyId } from '@/types/currency';
import { type Item } from '@/types/item';

import { invalidateGetMyRotationalCoinStore } from '../useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';

type ItemToPurchase = DeepReadonly<{
  id: Item['id'];
  price: { value: number; currencyId: CurrencyId };
}>;

type Props = Readonly<{ onSuccess?: () => void }>;

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
