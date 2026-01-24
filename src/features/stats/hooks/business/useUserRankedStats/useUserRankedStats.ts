import { type RefreshableState } from '@/types/loadableState';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { type Rank } from '../../../types/rank';
import { type Season } from '../../../types/season';
import { type PlayerPosition, type PlayerStatistics, StatisticName } from '../../../types/stats';
import { getRank } from '../../../utils/getRank';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const getEloStatNameForSeason = (seasonIndex: number): StatisticName =>
  StatisticName[`RANKED_S${seasonIndex}_ELO` as keyof typeof StatisticName];

const getSetStatsForSeason = (rawStats: PlayerStatistics, season: Season) => {
  if (!season.isFirst && !season.isLast) return undefined;

  const result = {
    setCount: rawStats[StatisticName.RANKED_SETS] ?? 0,
    winCount: rawStats[StatisticName.RANKED_WINS] ?? 0,
    winRate: 0,
  };

  if (season.isFirst) {
    result.setCount = rawStats[StatisticName.RANKED_S1_SETS] ?? 0;
    result.winCount = rawStats[StatisticName.RANKED_S1_WINS] ?? 0;
  }

  result.winRate = result.setCount ? (result.winCount / result.setCount) * 100 : 0;

  return result;
};

type UserRankedStats = RefreshableState<{
  stats: {
    elo: number | undefined;
    rank: Rank | undefined;
    playerCount: number;
    setStats:
      | {
          setCount: number;
          winCount: number;
          winRate: number;
        }
      | undefined;
    bestWinStreak: number;
  } & Pick<PlayerPosition, 'position' | 'profile'>;
}>;

export const useUserRankedStats = (): UserRankedStats => {
  const { season } = useSeason();
  const {
    statistics: rawStats,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
    refetch: refetchPlayerStatistics,
  } = useGetPlayerStatistics();
  const {
    playerPositions,
    isLoading: isLoadingPlayerPosition,
    isRefetching: isRefetchingPlayerPosition,
    refetch: refetchPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: getEloStatNameForSeason(season.index),
  });
  const { leaderboardEntries, isLoading: isLoadingLeaderboardStats } = useLeaderboardStats();

  const baseState = {
    stats: undefined,
    isLoading: false,
    isError: false,
    isRefreshing: isRefetchingRawStats || isRefetchingPlayerPosition,
    refresh: () => {
      void refetchPlayerStatistics();
      void refetchPlayerPosition();
    },
  } as const;

  if (rawStats && playerPositions && leaderboardEntries) {
    const [userRankedPosition] = playerPositions;
    const elo = rawStats[getEloStatNameForSeason(season.index)];
    const rank = elo != null && userRankedPosition ? getRank(elo, userRankedPosition?.position) : undefined;
    return {
      ...baseState,
      stats: {
        elo,
        rank,
        position: userRankedPosition.position,
        profile: userRankedPosition.profile,
        playerCount: leaderboardEntries.length,
        setStats: getSetStatsForSeason(rawStats, season),
        bestWinStreak: rawStats[StatisticName.RANKED_BEST_WIN_STREAK] ?? 0,
      },
    };
  }

  if (isLoadingRawStats || isLoadingPlayerPosition || isLoadingLeaderboardStats) {
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
