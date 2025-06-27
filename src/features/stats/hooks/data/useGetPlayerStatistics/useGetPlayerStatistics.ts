import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type PlayerStatistics, type StatisticName } from '../../../types/stats';

type GetPlayerStatisticsResponse = {
  Statistics: {
    StatisticName: StatisticName;
    Value: number;
  }[];
};

export const useGetPlayerStatistics = () => {
  const apiClient = useGameApiClient();

  const { data, refetch, isFetching, isPending, isError } = useQuery({
    queryKey: ['playerStatistics'],
    queryFn: () => apiClient.post<GetPlayerStatisticsResponse>('/Client/GetPlayerStatistics'),
    select: (data) =>
      data.Statistics.reduce((acc, { StatisticName, Value }) => {
        acc[StatisticName] = Value;
        return acc;
      }, {} as PlayerStatistics),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    statistics: data,
    refetch,
    isLoading: isFetching || isPending,
    isError,
  };
};
