import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { Category } from '@/types/item';
import { imageUrlFromFriendlyId } from '@/utils/imageUrlFromFriendlyId';

import { type PlayerPosition, type StatisticName } from '../../../types/stats';

type GetLeaderboardAroundPlayerOptions = Readonly<{
  maxResultCount: number;
  statisticName?: StatisticName;
}>;

type GetLeaderboardAroundPlayerRequest = DeepReadonly<{
  StatisticName: StatisticName;
  MaxResultsCount: number;
  ProfileConstraints: {
    ShowDisplayName: boolean;
    ShowAvatarUrl: boolean;
  };
}>;

type GetLeaderboardAroundPlayerResponse = DeepReadonly<{
  Leaderboard: {
    StatValue: number;
    Position: number;
    Profile: {
      DisplayName: string;
      AvatarUrl: string;
    };
  }[];
}>;

export const useGetLeaderboardAroundPlayer = ({ maxResultCount, statisticName }: GetLeaderboardAroundPlayerOptions) => {
  const apiClient = useGameApiClient();

  const { data, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['getLeaderboardAroundPlayer', maxResultCount, statisticName],
    queryFn: () =>
      apiClient.post<GetLeaderboardAroundPlayerResponse, GetLeaderboardAroundPlayerRequest>(
        '/Client/GetLeaderboardAroundPlayer',
        {
          body: {
            StatisticName: statisticName!,
            MaxResultsCount: maxResultCount,
            ProfileConstraints: {
              ShowDisplayName: true,
              ShowAvatarUrl: true,
            },
          },
        },
      ),
    select: ({ Leaderboard: leaderboards }): [PlayerPosition, ...PlayerPosition[]] => {
      if (!leaderboards.length) throw new Error(`The player is not ranked for the statistic ${statisticName}`);

      return leaderboards.map(
        ({
          StatValue: statisticValue,
          Position: position,
          Profile: { DisplayName: playerName, AvatarUrl: friendlyId },
        }) => ({
          statisticName,
          statisticValue,
          position,
          profile: {
            playerName,
            avatarUrl: imageUrlFromFriendlyId(Category.ICON, friendlyId),
          },
        }),
      ) as [PlayerPosition, ...PlayerPosition[]];
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: Boolean(statisticName),
  });

  return {
    playerPositions: data,
    isLoading: isPending,
    isRefetching,
    refetch,
  } as const;
};
