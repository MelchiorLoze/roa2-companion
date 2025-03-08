import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { CurrencyId, Item } from '@/types/store';

import { invalidateGetInventoryItems } from '../useGetInventoryItems/useGetInventoryItems';
import { invalidateGetMyRotationalCoinStore } from '../useMyRotationalCoinStore/useGetMyRotationalCoinStore';

type ItemToPurchase = {
  id: Item['id'];
  price: { value: number; currencyId: CurrencyId };
};

export async function purchaseInventoryItems(entityToken: string, item: ItemToPurchase): Promise<object> {
  const response = await fetch(`${BASE_URL}/Inventory/PurchaseInventoryItems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-EntityToken': entityToken,
    },
    body: JSON.stringify({
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
  });

  if (!response.ok) {
    throw new Error('Failed to purchase inventory item');
  }

  return await response.json();
}

export const usePurchaseInventoryItems = () => {
  const { entityToken, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (item: ItemToPurchase) => purchaseInventoryItems(entityToken ?? '', item),
    onSuccess: (_, item) => {
      invalidateGetInventoryItems(queryClient);
      if (item.price.currencyId === CurrencyId.COINS) invalidateGetMyRotationalCoinStore(queryClient);
    },
  });

  const purchase = isLoggedIn ? mutate : undefined;

  return { purchase, isLoading: isPending, isError };
};
