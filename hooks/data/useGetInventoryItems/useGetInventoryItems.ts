import { QueryClient, useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { InventoryItem } from '@/types/store';

const QUERY_KEY = ['inventoryItems'];

type GetInventoryItemsResponse = {
  Items: {
    Id: string;
    Amount: number;
  }[];
};

export const useGetInventoryItems = () => {
  const httpCLient = useHttpClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      httpCLient.post<GetInventoryItemsResponse>('/Inventory/GetInventoryItems', {
        Count: 10000,
      }),
    select: (data) => data.Items.map((item) => ({ id: item.Id, amount: item.Amount } as InventoryItem)),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { inventoryItems: data ?? [], isLoading, isError };
};

export const invalidateGetInventoryItems = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
