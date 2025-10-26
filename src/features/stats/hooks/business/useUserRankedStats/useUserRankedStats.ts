import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { type Season } from '../../../types/season';
import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { getRank } from '../../../utils/getRank';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const getEloStatNameForSeason = (seasonIndex: number): StatisticName =>
  StatisticName[`RANKED_S${seasonIndex}_ELO` as keyof typeof StatisticName];

const getSetStatsForSeason = (rawStats: PlayerStatistics | undefined, season: Season) => {
  if (!rawStats || (!season.isFirst && !season.isLast)) return undefined;

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

export const useUserRankedStats = () => {
  const { season } = useSeason();
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
  } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPosition,
    isLoading: isLoadingPlayerPosition,
    isRefetching: isRefetchingPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: getEloStatNameForSeason(season.index),
  });
  const { leaderboardEntries } = useLeaderboardStats();

  const refresh = () => {
    void refetchPlayerStatistics();
    void refetchPlayerPosition();
  };

  const isLoading = isLoadingRawStats || isLoadingPlayerPosition;
  const isRefreshing = isRefetchingRawStats || isRefetchingPlayerPosition;

  const setStats = getSetStatsForSeason(rawStats, season);
  const elo = rawStats?.[getEloStatNameForSeason(season.index)];
  const rank = elo != null && userRankedPosition ? getRank(elo, userRankedPosition.position) : undefined;
  const bestWinStreak = rawStats ? (rawStats[StatisticName.RANKED_BEST_WIN_STREAK] ?? 0) : undefined;

  return {
    stats: {
      elo,
      rank,
      bestWinStreak,
      position: userRankedPosition?.position,
      profile: userRankedPosition?.profile,
      playerCount: leaderboardEntries.length,
      setStats,
    },
    refresh,
    isLoading,
    isRefreshing,
  } as const;
};
