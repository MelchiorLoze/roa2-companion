import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type PlayerPosition, type StatisticName } from '../../../types/stats';

type GetLeaderboardAroundPlayerRequest = Readonly<{
  maxResultCount: number;
  statisticName: StatisticName;
}>;

type GetLeaderboardAroundPlayerResponse = DeepReadonly<{
  Leaderboard: {
    DisplayName: string;
    StatValue: number;
    Position: number;
  }[];
}>;

export const useGetLeaderboardAroundPlayer = ({ maxResultCount, statisticName }: GetLeaderboardAroundPlayerRequest) => {
  const apiClient = useGameApiClient();

  const { data, refetch, isPending, isRefetching, isError } = useQuery({
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
    isLoading: isPending,
    isRefetching,
    isError,
  } as const;
};
