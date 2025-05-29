import { useQuery } from '@tanstack/react-query';

import { STEAM_APP_ID } from '@/constants';
import { useSteamCommunityApiClient } from '@/hooks/apiClients';

type CommunityLeaderboardResponse = {
  resultCount: number;
  totalLeaderboardEntries: number;
  entryStart: number;
  entryEnd: number;
  entries: {
    entry: {
      steamid: string;
      score: number;
      rank: number;
    }[];
  };
};

type LeaderboardEntry = {
  steamId: string;
  position: number;
  elo: number;
};

export const useCommunityLeaderboard = (leaderboardId: number = -1) => {
  const apiClient = useSteamCommunityApiClient();

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['communityLeaderboard', leaderboardId],
    queryFn: async () => {
      let totalLeaderboardEntries = 0;
      const leaderboardEntries: LeaderboardEntry[] = [];
      let entryStart = 0;
      do {
        const response = await apiClient.get<CommunityLeaderboardResponse>(
          `/stats/${STEAM_APP_ID}/leaderboards/${leaderboardId}`,
          { params: { start: entryStart.toString() } },
        );
        if (!totalLeaderboardEntries) totalLeaderboardEntries = response.totalLeaderboardEntries;
        leaderboardEntries.push(
          ...response.entries.entry.map((entry) => ({
            steamId: entry.steamid,
            position: entry.rank,
            elo: entry.score,
          })),
        );
        entryStart = response.entryEnd + 1;
      } while (leaderboardEntries.length < totalLeaderboardEntries);

      return leaderboardEntries;
    },
    enabled: leaderboardId !== -1,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    leaderboardEntries: data ?? [],
    isLoading: isFetching || isPending,
    isError,
  };
};
