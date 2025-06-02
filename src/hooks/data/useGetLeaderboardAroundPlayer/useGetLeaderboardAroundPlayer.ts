import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import type { PlayerPosition } from '@/types/stats';
import { StatisticName } from '@/types/stats';

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
  const apiClient = useGameApiClient();

  const { data, refetch, isFetching, isPending, isError } = useQuery({
    queryKey: ['getLeaderboardAroundPlayer', maxResultCount, statisticName],
    queryFn: () =>
      apiClient.post<GetLeaderboardAroundPlayerResponse>('/Client/GetLeaderboardAroundPlayer', {
        body: {
          MaxResultCount: maxResultCount,
          StatisticName: statisticName,
        },
      }),
    select: (data) =>
      data.Leaderboard.map(
        ({ DisplayName, StatValue, Position }) =>
          ({
            playerName: DisplayName,
            statisticName: statisticName,
            statisticValue: StatValue,
            position: Position,
          }) as PlayerPosition,
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
