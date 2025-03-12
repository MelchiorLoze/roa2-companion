import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHttpClient } from '@/networking';
import { CurrencyId, Item } from '@/types/store';

import { invalidateGetInventoryItems } from '../useGetInventoryItems/useGetInventoryItems';
import { invalidateGetMyRotationalCoinStore } from '../useMyRotationalCoinStore/useGetMyRotationalCoinStore';

type ItemToPurchase = {
  id: Item['id'];
  price: { value: number; currencyId: CurrencyId };
};

export const usePurchaseInventoryItems = () => {
  const httpClient = useHttpClient();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (item: ItemToPurchase) =>
      httpClient.post('/Inventory/PurchaseInventoryItems', {
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
      }),
    onSuccess: (_, item) => {
      invalidateGetInventoryItems(queryClient);
      if (item.price.currencyId === CurrencyId.COINS) invalidateGetMyRotationalCoinStore(queryClient);
    },
  });

  return { purchase: mutate, isLoading: isPending, isError };
};
