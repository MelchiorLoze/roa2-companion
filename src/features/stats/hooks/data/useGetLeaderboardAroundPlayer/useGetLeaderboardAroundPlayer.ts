import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';
import { Category } from '@/types/item';
import { imageUrlFromFriendlyId } from '@/utils/imageUrlFromFriendlyId';

import { type PlayerPosition, type StatisticName } from '../../../types/stats';

type GetLeaderboardAroundPlayerRequest = Readonly<{
  maxResultCount: number;
  statisticName: StatisticName;
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

export const useGetLeaderboardAroundPlayer = ({ maxResultCount, statisticName }: GetLeaderboardAroundPlayerRequest) => {
  const apiClient = useGameApiClient();

  const { data, refetch, isPending, isRefetching, isError } = useQuery({
    queryKey: ['getLeaderboardAroundPlayer', maxResultCount, statisticName],
    queryFn: () =>
      apiClient.post<GetLeaderboardAroundPlayerResponse>('/Client/GetLeaderboardAroundPlayer', {
        body: {
          StatisticName: statisticName,
          MaxResultsCount: maxResultCount,
          ProfileConstraints: {
            ShowDisplayName: true,
            ShowAvatarUrl: true,
          },
        },
      }),
    select: (data): PlayerPosition[] =>
      data.Leaderboard.map(({ StatValue, Position, Profile }) => ({
        statisticName: statisticName,
        statisticValue: StatValue,
        position: Position,
        profile: {
          playerName: Profile.DisplayName,
          avatarUrl: imageUrlFromFriendlyId(Category.ICON, Profile.AvatarUrl),
        },
      })),
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
