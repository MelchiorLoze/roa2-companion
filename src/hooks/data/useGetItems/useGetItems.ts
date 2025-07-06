import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { type Item, type ItemDto } from '@/types/item';
import { itemFromDto } from '@/utils/itemFromDto';

type GetItemsResponse = Readonly<{
  Items: ItemDto[];
}>;

export const useGetItems = (itemIds: Item['id'][]) => {
  const apiClient = useGameApiClient();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['items', ...itemIds],
    queryFn: () => apiClient.post<GetItemsResponse>('/Catalog/GetItems', { body: { Ids: itemIds } }),
    enabled: itemIds.length > 0,
    select: (data) => data.Items.map(itemFromDto),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    items: data ?? [],
    isLoading: isFetching,
    isError,
  } as const;
};
