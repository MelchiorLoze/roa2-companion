import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';

type GetPlayerStatisticsResponse = DeepReadonly<{
  Statistics: {
    StatisticName: StatisticName;
    Value: number;
  }[];
}>;

export const useGetPlayerStatistics = () => {
  const apiClient = useGameApiClient();

  const { data, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['playerStatistics'],
    queryFn: () => apiClient.post<GetPlayerStatisticsResponse>('/Client/GetPlayerStatistics'),
    select: (data): PlayerStatistics =>
      data.Statistics.reduce<PlayerStatistics>(
        (acc, { StatisticName: name, Value }) => {
          acc[name] = Value;
          return acc;
        },
        { [StatisticName.RANKED_SEASON_INDEX]: 1 },
      ),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    statistics: data,
    isLoading: isPending,
    isRefetching,
    refetch,
  } as const;
};
