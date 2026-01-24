import { type LoadableState } from '@/types/loadableState';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { type LeaderboardEntry, MAX_AETHEREAN_PLAYERS, Rank, RANK_ELO_THRESHOLDS } from '../../../types/rank';
import { useCommunityLeaderboard } from '../../data/useCommunityLeaderboard/useCommunityLeaderboard';

type LeaderboardStatsState = LoadableState<{
  firstPlayerElo: number;
  lastPlayerElo: number;
  lastAethereanElo: number;
  leaderboardEntries: LeaderboardEntry[];
}>;

export const useLeaderboardStats = (): LeaderboardStatsState => {
  const { leaderboardId, isLoading: isLoadingSeason } = useSeason();
  const { leaderboardEntries, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(leaderboardId);

  const baseState = {
    firstPlayerElo: undefined,
    lastPlayerElo: undefined,
    lastAethereanElo: undefined,
    leaderboardEntries: undefined,
    isLoading: false,
    isError: false,
  } as const;

  if (leaderboardEntries?.length) {
    return {
      ...baseState,
      firstPlayerElo: leaderboardEntries[0].elo,
      lastPlayerElo: Math.min(0, leaderboardEntries[leaderboardEntries.length - 1].elo),
      lastAethereanElo:
        leaderboardEntries.findLast(
          (entry) => entry.elo > RANK_ELO_THRESHOLDS[Rank.AETHEREAN] && entry.position < MAX_AETHEREAN_PLAYERS,
        )?.elo ?? 0,
      leaderboardEntries,
    } as const;
  }

  if (isLoadingSeason || isLoadingLeaderboard) {
    return {
      ...baseState,
      isLoading: true,
    } as const;
  }

  return {
    ...baseState,
    isError: true,
  } as const;
};
