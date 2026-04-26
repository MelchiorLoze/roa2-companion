import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { type Item, type ItemDto } from '@/types/item';
import { itemFromDto } from '@/utils/itemFromDto';

type GetItemsRequest = Readonly<{
  Ids: readonly Item['id'][];
}>;

type GetItemsResponse = Readonly<{
  Items: ItemDto[];
}>;

export const useGetItems = (itemIds: readonly Item['id'][]) => {
  const apiClient = useGameApiClient();
  const enabled = itemIds.length > 0;

  const { data, isPending } = useQuery({
    queryKey: ['items', ...itemIds],
    queryFn: () => apiClient.post<GetItemsResponse, GetItemsRequest>('/Catalog/GetItems', { body: { Ids: itemIds } }),
    enabled,
    select: ({ Items: items }) => items.map(itemFromDto),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    items: data,
    isLoading: enabled && isPending,
  } as const;
};
