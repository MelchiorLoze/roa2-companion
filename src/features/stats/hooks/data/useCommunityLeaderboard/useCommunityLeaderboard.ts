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

const queryFn = async (
  apiClient: ReturnType<typeof useSteamCommunityApiClient>,
  leaderboardId: Leaderboard['id'],
): Promise<LeaderboardEntry[]> => {
  let entryStart = 0;
  let response: CommunityLeaderboardResponse;
  const leaderboardEntries: LeaderboardEntry[] = [];

  do {
    response = await apiClient.get<CommunityLeaderboardResponse>(
      `/stats/${STEAM_APP_ID}/leaderboards/${leaderboardId}`,
      { params: { start: entryStart.toString() } },
    );

    leaderboardEntries.push(
      ...response.entries.entry.map((entry) => ({
        steamId: entry.steamid,
        position: entry.rank,
        elo: entry.score,
      })),
    );

    entryStart = response.entryEnd + 1;
  } while (leaderboardEntries.length < response.totalLeaderboardEntries);

  return leaderboardEntries;
};

export const useCommunityLeaderboard = (leaderboardId: Leaderboard['id'] = -1) => {
  const apiClient = useSteamCommunityApiClient();
  const enabled = leaderboardId !== -1;

  const { data, isPending } = useQuery({
    queryKey: ['communityLeaderboard', leaderboardId],
    queryFn: () => queryFn(apiClient, leaderboardId),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    leaderboardEntries: data,
    isLoading: enabled && isPending,
  } as const;
};
