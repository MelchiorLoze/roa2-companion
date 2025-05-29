import { useQuery } from '@tanstack/react-query';

import { STEAM_APP_ID } from '@/constants';
import { useSteamCommunityApiClient } from '@/hooks/apiClients';

type CommunityLeaderboardsResponse = {
  leaderboard: {
    name: string;
    display_name: string;
    entries: number;
    lbid: number;
  }[];
};

type Leaderboard = {
  id: number;
  name: string;
  displayName: string;
  entryCount: number;
};

export const useCommunityLeaderboards = () => {
  const apiClient = useSteamCommunityApiClient();

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['communityLeaderboards'],
    queryFn: () => apiClient.get<CommunityLeaderboardsResponse>(`/stats/${STEAM_APP_ID}/leaderboards`),
    select: (data) =>
      data.leaderboard.map((leaderboard) => ({
        id: leaderboard.lbid,
        name: leaderboard.name,
        displayName: leaderboard.display_name,
        entryCount: leaderboard.entries,
      })) as Leaderboard[],
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    leaderboards: data ?? [],
    isLoading: isFetching || isPending,
    isError,
  };
};
