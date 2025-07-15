import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { MAX_SEASON_INDEX, MIN_SEASON_INDEX, type PlayerStatistics, StatisticName } from '../../../types/stats';
import { getRank } from '../../../utils/getRank';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const getEloStatNameForSeason = (seasonIndex: number) =>
  StatisticName[`RANKED_S${seasonIndex}_ELO` as keyof typeof StatisticName];

const getSetStatsForSeason = (rawStats: PlayerStatistics | undefined, seasonIndex: number) => {
  if (!rawStats || (seasonIndex !== MIN_SEASON_INDEX && seasonIndex !== MAX_SEASON_INDEX)) return undefined;

  const result = {
    setCount: rawStats[StatisticName.RANKED_SETS] ?? 0,
    winCount: rawStats[StatisticName.RANKED_WINS] ?? 0,
    winRate: 0,
  };

  if (seasonIndex === MIN_SEASON_INDEX) {
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

  const setStats = getSetStatsForSeason(rawStats, season.index);
  const elo =
    !rawStats || (setStats && setStats.winCount < 4) ? undefined : rawStats[getEloStatNameForSeason(season.index)];
  const rank = elo != null && userRankedPosition ? getRank(elo, userRankedPosition.position) : undefined;

  return {
    stats: {
      elo,
      rank,
      position: userRankedPosition?.position,
      playerCount: leaderboardEntries.length,
      setStats,
    },
    refresh,
    isLoading,
    isRefreshing,
  } as const;
};
