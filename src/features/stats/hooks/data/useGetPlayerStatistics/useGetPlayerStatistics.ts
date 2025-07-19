import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type PlayerStatistics, type StatisticName } from '../../../types/stats';

type GetPlayerStatisticsResponse = DeepReadonly<{
  Statistics: {
    StatisticName: StatisticName;
    Value: number;
  }[];
}>;

export const useGetPlayerStatistics = () => {
  const apiClient = useGameApiClient();

  const { data, refetch, isPending, isRefetching, isError } = useQuery({
    queryKey: ['playerStatistics'],
    queryFn: () => apiClient.post<GetPlayerStatisticsResponse>('/Client/GetPlayerStatistics'),
    select: (data): PlayerStatistics =>
      data.Statistics.reduce<PlayerStatistics>((acc, { StatisticName, Value }) => {
        acc[StatisticName] = Value;
        return acc;
      }, {}),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    statistics: data,
    refetch,
    isLoading: isPending,
    isRefetching,
    isError,
  } as const;
};
