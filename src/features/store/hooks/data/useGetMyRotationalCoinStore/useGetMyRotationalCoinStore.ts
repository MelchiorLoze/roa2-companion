import { type QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { type ExecuteFunctionRequest, type ExecuteFunctionResponse } from '@/types/executeFunction';
import { type Item } from '@/types/item';

const QUERY_KEY = ['getMyRotationalCoinStore'];

type GetMyRotationalCoinStoreResponse = ExecuteFunctionResponse<{
  expirationDateTime: string;
  itemIds: (Item['id'] | null)[];
}>;

type RotationalCoinStore = Readonly<{
  expirationDate: DateTime;
  itemIds: readonly Item['id'][];
}>;

export const useGetMyRotationalCoinStore = () => {
  const apiClient = useGameApiClient();
  const queryClient = useQueryClient();

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      apiClient.post<GetMyRotationalCoinStoreResponse>('/CloudScript/ExecuteFunction', {
        body: {
          FunctionName: 'GetMyRotationalCoinStore',
        } as ExecuteFunctionRequest,
      }),
    select: ({ FunctionResult: result }): RotationalCoinStore => ({
      itemIds: result.itemIds.filter((id) => id !== null),
      expirationDate: DateTime.fromISO(result.expirationDateTime, { zone: 'utc' }),
    }),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;

    const timeUntilExpiration = data.expirationDate.diffNow().as('millisecond');
    const timeout = setTimeout(() => {
      invalidateGetMyRotationalCoinStore(queryClient);
    }, timeUntilExpiration);

    return () => clearTimeout(timeout);
  }, [data, queryClient]);

  return { rotationalCoinStore: data, isLoading: isPending || isFetching, isError } as const;
};

export const invalidateGetMyRotationalCoinStore = (queryClient: QueryClient): void => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
};
