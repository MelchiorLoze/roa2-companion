import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { Statistic } from '@/types/stats';

type GetPlayerStatisticsResponse = {
  Statistics: {
    StatisticName: string;
    Value: number;
  }[];
};

export const useGetPlayerStatistics = () => {
  const httpClient = useHttpClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['playerStatistics'],
    queryFn: async () => httpClient.post<GetPlayerStatisticsResponse>('/Client/GetPlayerStatistics'),
    select: (data) =>
      data.Statistics.map(({ StatisticName, Value }) => ({ name: StatisticName, value: Value } as Statistic)),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    statistics: data ?? [],
    isLoading,
    isError,
  };
};
