import { type QueryClient, useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { type Item } from '@/types/item';

const QUERY_KEY = ['inventoryItems'];

type GetInventoryItemsRequest = Readonly<{
  Count: number;
}>;

type GetInventoryItemsResponse = DeepReadonly<{
  Items: {
    Id: string;
    Amount: number;
  }[];
}>;

type InventoryItem = Readonly<
  Pick<Item, 'id'> & {
    amount: number;
  }
>;

export const useGetInventoryItems = () => {
  const apiClient = useGameApiClient();

  const { data, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      apiClient.post<GetInventoryItemsResponse, GetInventoryItemsRequest>('/Inventory/GetInventoryItems', {
        body: {
          Count: 10000,
        },
      }),
    select: ({ Items: items }): InventoryItem[] => items.map(({ Id: id, Amount: amount }) => ({ id, amount })),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { inventoryItems: data, isLoading: isPending } as const;
};

export const invalidateGetInventoryItems = (queryClient: QueryClient): void => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
