import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { Category, CurrencyId, Item } from '@/types/store';

// above 9 items, the server will return an error
const MAX_ITEMS_PER_REQUEST = 9;

type SearchItemsResponse = {
  data: {
    Items: {
      Id: string;
      Title: { NEUTRAL: string };
      ContentType: Category;
      PriceOptions: {
        Prices: {
          Amounts: {
            ItemId: CurrencyId;
            Amount: number;
          }[];
        }[];
      };
    }[];
  };
};

const getPrice = (item: SearchItemsResponse['data']['Items'][0], currencyId: CurrencyId) => {
  return item.PriceOptions.Prices.find((price) => price.Amounts[0].ItemId === currencyId)?.Amounts[0].Amount;
};

const searchItems = async (entityToken: string, itemIds: string[]) => {
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

  return responeData.data.Items.map(
    (item) =>
      ({
        id: item.Id,
        title: item.Title.NEUTRAL,
        category: item.ContentType,
        buckPrice: getPrice(item, CurrencyId.BUCKS),
        coinPrice: getPrice(item, CurrencyId.COINS),
      } as Item),
  );
};

export function useSearchItems(itemIds: string[]) {
  const { entityToken, isLoggedIn } = useAuth();

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
