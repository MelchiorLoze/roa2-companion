import { type RefreshableState } from '@/types/loadableState';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { type Rank } from '../../../types/rank';
import { type Season } from '../../../types/season';
import { type PlayerPosition, type PlayerStatistics, StatisticName } from '../../../types/stats';
import { getRank } from '../../../utils/getRank';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const getEloStatNameForSeason = (season: Season): StatisticName => {
  if (season.isFirst) return StatisticName.RANKED_S1_ELO;
  return `Ranked_SeasonEloPure_${season.index}` as StatisticName;
};

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

type UserRankedStatsState = RefreshableState<{
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

export const useUserRankedStats = (): UserRankedStatsState => {
  const { season, isLoading: isLoadingSeason } = useSeason();
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
    statisticName: season && getEloStatNameForSeason(season),
  });
  const { leaderboardEntries } = useLeaderboardStats();

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

  if (season && rawStats && playerPositions) {
    const [userRankedPosition] = playerPositions;
    const elo = rawStats[getEloStatNameForSeason(season)];
    const rank = elo != null ? getRank(elo, userRankedPosition.position) : undefined;
    return {
      ...baseState,
      stats: {
        elo,
        rank,
        position: userRankedPosition.position,
        profile: userRankedPosition.profile,
        playerCount: leaderboardEntries?.length ?? 0,
        setStats: getSetStatsForSeason(rawStats, season),
        bestWinStreak: rawStats[StatisticName.RANKED_BEST_WIN_STREAK] ?? 0,
      },
    };
  }

  if (isLoadingSeason || isLoadingRawStats || isLoadingPlayerPosition) {
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
