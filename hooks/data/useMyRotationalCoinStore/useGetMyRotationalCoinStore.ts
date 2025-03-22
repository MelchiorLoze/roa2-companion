import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

import { useHttpClient } from '@/hooks/core';
import { ExecuteFunctionRequest, ExecuteFunctionResponse } from '@/types/executeFunction';
import { Item, RotationalCoinStore } from '@/types/store';

const QUERY_KEY = ['getMyRotationalCoinStore'];

type GetMyRotationalCoinStoreResponse = ExecuteFunctionResponse<{
  expirationDateTime: string;
  itemIds: Item['id'][];
}>;

export const useGetMyRotationalCoinStore = () => {
  const httpClient = useHttpClient();
  const queryClient = useQueryClient();

  const { data, isFetching, isPending, isError } = useQuery({
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
    gcTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;

    const timeUntilExpiration = data.expirationDate.diffNow().as('millisecond');
    const timeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }, timeUntilExpiration);

    return () => clearTimeout(timeout);
  }, [data, queryClient]);

  return { rotationalCoinStore: data, isLoading: isFetching || isPending, isError };
};

export const invalidateGetMyRotationalCoinStore = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: QUERY_KEY });
};
