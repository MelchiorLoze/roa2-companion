import { useQuery } from '@tanstack/react-query';

import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { Item, ItemDto } from '@/types/store';
import { itemFromDto } from '@/utils/itemFromDto';

type GetItemsResponse = {
  data: {
    Items: ItemDto[];
  };
};

const getItems = async (entityToken: string, itemIds: Item['id'][]) => {
  const response = await fetch(`${BASE_URL}/Catalog/GetItems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-EntityToken': entityToken,
    },
    body: JSON.stringify({ Ids: itemIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to get items');
  }

  const responseData = (await response.json()) as GetItemsResponse;

  return responseData.data.Items.map(itemFromDto);
};

export const useGetItems = (itemIds: Item['id'][]) => {
  const { entityToken, isLoggedIn } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['items', ...itemIds],
    queryFn: () => getItems(entityToken ?? '', itemIds),
    enabled: isLoggedIn && itemIds.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    items: data ?? [],
    isLoading,
    isError,
  };
};
