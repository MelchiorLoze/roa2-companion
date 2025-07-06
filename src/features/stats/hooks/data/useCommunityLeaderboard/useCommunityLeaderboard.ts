import { useQuery } from '@tanstack/react-query';

import { STEAM_APP_ID } from '@/constants';
import { useSteamCommunityApiClient } from '@/hooks/apiClients/useSteamCommunityApiClient/useSteamCommunityApiClient';

import { type Leaderboard, type LeaderboardEntry } from '../../../types/rank';

type CommunityLeaderboardResponse = DeepReadonly<{
  resultCount: number;
  totalLeaderboardEntries: number;
  entryStart: number;
  entryEnd: number;
  entries: {
    entry: {
      steamid: number;
      score: number;
      rank: number;
    }[];
  };
}>;

const queryFn = async (apiClient: ReturnType<typeof useSteamCommunityApiClient>, leaderboardId: Leaderboard['id']) => {
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
};

export const useCommunityLeaderboard = (leaderboardId: Leaderboard['id'] = -1) => {
  const apiClient = useSteamCommunityApiClient();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['communityLeaderboard', leaderboardId],
    queryFn: () => queryFn(apiClient, leaderboardId),
    enabled: leaderboardId !== -1,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    leaderboardEntries: data ?? [],
    isLoading: isFetching,
    isError,
  } as const;
};
