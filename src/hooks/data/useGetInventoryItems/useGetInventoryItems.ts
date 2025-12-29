import { type QueryClient, useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { type Item } from '@/types/item';

const QUERY_KEY = ['inventoryItems'];

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

  const { data, isPending, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      apiClient.post<GetInventoryItemsResponse>('/Inventory/GetInventoryItems', {
        body: {
          Count: 10000,
        },
      }),
    select: (data): InventoryItem[] => data.Items.map((item) => ({ id: item.Id, amount: item.Amount })),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { inventoryItems: data ?? [], isLoading: isPending, isError } as const;
};

export const invalidateGetInventoryItems = (queryClient: QueryClient): void => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
