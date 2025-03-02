import { useQuery } from '@tanstack/react-query';

import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { InventoryItem } from '@/types/store';

type GetInventoryItemsResponse = {
  data: {
    Items: {
      Id: string;
      Amount: number;
    }[];
  };
};

async function getInventoryItems(entityToken: string): Promise<InventoryItem[]> {
  const response = await fetch(`${BASE_URL}/Inventory/GetInventoryItems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-EntityToken': entityToken,
    },
    body: JSON.stringify({
      Count: 10000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get inventory items');
  }

  const responseData = (await response.json()) as GetInventoryItemsResponse;
  const result = responseData.data.Items;

  return result.map((item) => ({
    id: item.Id,
    amount: item.Amount,
  }));
}

export const useGetInventoryItems = () => {
  const { entityToken, isLoggedIn } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: () => getInventoryItems(entityToken ?? ''),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { inventoryItems: data, isLoading, isError };
};
