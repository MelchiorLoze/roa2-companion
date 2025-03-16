import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { Item, ItemDto } from '@/types/store';
import { itemFromDto } from '@/utils/itemFromDto';

type GetItemsResponse = {
  Items: ItemDto[];
};

export const useGetItems = (itemIds: Item['id'][]) => {
  const httpClient = useHttpClient();

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['items', ...itemIds],
    queryFn: () => httpClient.post<GetItemsResponse>('/Catalog/GetItems', { Ids: itemIds }),
    enabled: itemIds.length > 0,
    select: (data) => data.Items.map(itemFromDto),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    items: data ?? [],
    isLoading: isFetching || isPending,
    isError,
  };
};
