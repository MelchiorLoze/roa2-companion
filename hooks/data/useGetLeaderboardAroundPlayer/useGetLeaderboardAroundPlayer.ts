import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { PlayerPosition, StatisticName } from '@/types/stats';

type GetLeaderboardAroundPlayerRequest = {
  maxResultCount: number;
  statisticName: StatisticName;
};

type GetLeaderboardAroundPlayerResponse = {
  Leaderboard: {
    DisplayName: string;
    StatValue: number;
    Position: number;
  }[];
};

const defaultRequest: GetLeaderboardAroundPlayerRequest = {
  maxResultCount: 100,
  statisticName: StatisticName.RANKED_S2_ELO,
};

export const useGetLeaderboardAroundPlayer = ({ maxResultCount, statisticName } = defaultRequest) => {
  const httpClient = useHttpClient();

  const { data, refetch, isFetching, isPending, isError } = useQuery({
    queryKey: ['getLeaderboardAroundPlayer', maxResultCount, statisticName],
    queryFn: () =>
      httpClient.post<GetLeaderboardAroundPlayerResponse>('/Client/GetLeaderboardAroundPlayer', {
        MaxResultCount: maxResultCount,
        StatisticName: statisticName,
      }),
    select: (data) =>
      data.Leaderboard.map(
        ({ DisplayName, StatValue, Position }) =>
          ({
            displayName: DisplayName,
            statisticName: statisticName,
            statisticValue: StatValue,
            position: Position,
          } as PlayerPosition),
      ),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    playerPositions: data ?? [],
    refetch,
    isLoading: isFetching || isPending,
    isError,
  };
};
