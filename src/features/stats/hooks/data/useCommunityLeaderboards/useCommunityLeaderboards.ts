import { useQuery } from '@tanstack/react-query';

import { STEAM_APP_ID } from '@/constants';
import { useSteamCommunityApiClient } from '@/hooks/apiClients/useSteamCommunityApiClient/useSteamCommunityApiClient';

import { type Leaderboard } from '../../../types/rank';

type CommunityLeaderboardsResponse = DeepReadonly<{
  leaderboard: {
    lbid: number;
    name: string;
    display_name: string;
    entries: number;
  }[];
}>;

export const useCommunityLeaderboards = () => {
  const apiClient = useSteamCommunityApiClient();

  const { data, isPending } = useQuery({
    queryKey: ['communityLeaderboards'],
    queryFn: () => apiClient.get<CommunityLeaderboardsResponse>(`/stats/${STEAM_APP_ID}/leaderboards`),
    select: (data): Leaderboard[] =>
      data.leaderboard.map((leaderboard) => ({
        id: leaderboard.lbid,
        name: leaderboard.name,
        displayName: leaderboard.display_name,
        entryCount: leaderboard.entries,
      })),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    leaderboards: data,
    isLoading: isPending,
  } as const;
};
