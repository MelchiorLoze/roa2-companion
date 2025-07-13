import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

const getGlobalStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_SESSIONS_PLAYED] ?? 0;
  const winCount = rawStats[StatisticName.BETA_WINS] ?? 0;
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameStats: { gameCount, winCount, winRate } } as const;
};

export const useUserGlobalStats = () => {
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
  } = useGetPlayerStatistics();

  const refresh = () => void refetchPlayerStatistics();
  const stats = rawStats && !isLoadingRawStats ? getGlobalStats(rawStats) : undefined;

  return { stats, refresh, isLoading: isLoadingRawStats } as const;
};
