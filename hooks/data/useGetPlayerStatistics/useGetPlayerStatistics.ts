import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { StatisticName, UserStats } from '@/types/stats';

type GetPlayerStatisticsResponse = {
  Statistics: {
    StatisticName: StatisticName;
    Value: number;
  }[];
};

export const useGetPlayerStatistics = () => {
  const httpClient = useHttpClient();

  const { data, refetch, isFetching, isPending, isError } = useQuery({
    queryKey: ['playerStatistics'],
    queryFn: async () => httpClient.post<GetPlayerStatisticsResponse>('/Client/GetPlayerStatistics'),
    select: (data) =>
      data.Statistics.reduce((acc, { StatisticName, Value }) => {
        acc[StatisticName] = Value;
        return acc;
      }, {} as UserStats),
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
