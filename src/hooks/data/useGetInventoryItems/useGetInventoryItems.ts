import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients';
import type { Item } from '@/types/item';

const QUERY_KEY = ['inventoryItems'];

type GetInventoryItemsResponse = {
  Items: {
    Id: string;
    Amount: number;
  }[];
};

type InventoryItem = Pick<Item, 'id'> & {
  amount: number;
};

export const useGetInventoryItems = () => {
  const apiClient = useGameApiClient();

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      apiClient.post<GetInventoryItemsResponse>('/Inventory/GetInventoryItems', {
        body: {
          Count: 10000,
        },
      }),
    select: (data) => data.Items.map((item) => ({ id: item.Id, amount: item.Amount }) as InventoryItem),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { inventoryItems: data ?? [], isLoading: isFetching || isPending, isError };
};

export const invalidateGetInventoryItems = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
