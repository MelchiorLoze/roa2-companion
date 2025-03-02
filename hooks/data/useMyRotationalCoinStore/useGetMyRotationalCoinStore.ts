import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime, Duration } from 'luxon';
import { useEffect } from 'react';

import { BASE_URL } from '@/constants';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { ExecuteFunctionRequest, ExecuteFunctionResponse } from '@/types/executeFunction';
import { RotationalCoinStore } from '@/types/store';

const TWENTY_FOUR_HOURS_IN_MS = Duration.fromObject({ hours: 24 }).as('milliseconds');
const QUERY_KEY = ['getMyRotationalCoinStore'];

type GetMyRotationalCointStoreResponse = ExecuteFunctionResponse<{
  expirationDateTime: string;
  itemIds: string[];
}>;

async function getMyRotationalCoinStore(entityToken: string): Promise<RotationalCoinStore> {
  const response = await fetch(`${BASE_URL}/CloudScript/ExecuteFunction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-EntityToken': entityToken,
    },
    body: JSON.stringify({
      FunctionName: 'GetMyRotationalCoinStore',
    } as ExecuteFunctionRequest<undefined>),
  });

  if (!response.ok) {
    throw new Error('Failed to get rotational coin store');
  }

  const responseData = (await response.json()) as GetMyRotationalCointStoreResponse;
  const result = responseData.data.FunctionResult;

  return {
    itemIds: result.itemIds,
    expirationDate: DateTime.fromISO(result.expirationDateTime),
  } as RotationalCoinStore;
}

export const useGetMyRotationalCoinStore = () => {
  const queryClient = useQueryClient();
  const { entityToken, isLoggedIn } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getMyRotationalCoinStore(entityToken ?? ''),
    enabled: isLoggedIn,
    gcTime: TWENTY_FOUR_HOURS_IN_MS,
    staleTime: TWENTY_FOUR_HOURS_IN_MS,
  });

  useEffect(() => {
    if (!data) return;

    const timeUntilExpiration = data.expirationDate.diffNow().as('millisecond');
    const timeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }, timeUntilExpiration);

    return () => clearTimeout(timeout);
  }, [data, queryClient]);

  return { rotationalCoinStore: data, isLoading, isError };
};

export const invalidateGetMyRotationalCoinStore = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
