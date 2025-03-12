import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime, Duration } from 'luxon';
import { useEffect } from 'react';

import { useHttpClient } from '@/hooks/core';
import { ExecuteFunctionRequest, ExecuteFunctionResponse } from '@/types/executeFunction';
import { Item, RotationalCoinStore } from '@/types/store';

const TWENTY_FOUR_HOURS_IN_MS = Duration.fromObject({ hours: 24 }).as('milliseconds');
const QUERY_KEY = ['getMyRotationalCoinStore'];

type GetMyRotationalCoinStoreResponse = ExecuteFunctionResponse<{
  expirationDateTime: string;
  itemIds: Item['id'][];
}>;

export const useGetMyRotationalCoinStore = () => {
  const httpClient = useHttpClient();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      httpClient.post<GetMyRotationalCoinStoreResponse>('/CloudScript/ExecuteFunction', {
        FunctionName: 'GetMyRotationalCoinStore',
      } as ExecuteFunctionRequest),
    select: ({ FunctionResult: result }) =>
      ({
        itemIds: result.itemIds,
        expirationDate: DateTime.fromISO(result.expirationDateTime),
      } as RotationalCoinStore),
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
  queryClient.removeQueries({ queryKey: QUERY_KEY });
};
