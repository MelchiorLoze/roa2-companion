import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { BASE_URL } from '@/constants';
import { useSession } from '@/contexts/AuthContext/AuthContext';
import { Item, ItemDto } from '@/types/store';
import { itemFromDto } from '@/utils/itemFromDto';

// above 9 items, the server will return an error
const MAX_ITEMS_PER_REQUEST = 9;

type SearchItemsResponse = {
  data: {
    Items: ItemDto[];
  };
};

const searchItems = async (entityToken: string, itemIds: Item['id'][]) => {
  if (itemIds.length > MAX_ITEMS_PER_REQUEST) {
    throw new Error('Too many items requested');
  }

  const response = await fetch(`${BASE_URL}/Catalog/SearchItems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-EntityToken': entityToken,
    },
    body: JSON.stringify({ Filter: itemIds.map((itemId) => `id eq '${itemId}'`).join(' or ') }),
  });

  if (!response.ok) {
    throw new Error('Failed to search items');
  }

  const responeData = (await response.json()) as SearchItemsResponse;

  return responeData.data.Items.map(itemFromDto);
};

export function useSearchItems(itemIds: Item['id'][]) {
  const { entityToken, isLoggedIn } = useSession();

  const batchSize = Math.min(MAX_ITEMS_PER_REQUEST, itemIds.length);

  // Create batches of IDs
  const batches = useMemo(() => {
    const result = [];
    for (let i = 0; i < itemIds.length; i += batchSize) {
      result.push(itemIds.slice(i, i + batchSize));
    }
    return result;
  }, [itemIds, batchSize]);

  // Create a query for each batch
  const batchQueries = useQueries({
    queries: batches.map((batchIds) => ({
      queryKey: ['searchItems', ...batchIds],
      queryFn: () => searchItems(entityToken ?? '', batchIds),
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: isLoggedIn && batchIds.length > 0,
    })),
  });

  // Process results from all batches
  const isLoading = batchQueries.some((query) => query.isLoading);
  const isError = batchQueries.some((query) => query.isError);
  const items = useMemo(() => {
    if (isLoading || isError) return [];
    return batchQueries.flatMap((query) => query.data || []);
  }, [batchQueries, isLoading, isError]);

  return { items, isLoading, isError };
}
