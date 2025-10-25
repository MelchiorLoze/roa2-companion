import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

const getGlobalGameStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_GAMES] ?? 0;
  const winCount = rawStats[StatisticName.TOTAL_WINS] ?? 0;
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameCount, winCount, winRate } as const;
};

export const useUserGlobalStats = () => {
  const { statistics: rawStats, refetch, isLoading, isRefetching } = useGetPlayerStatistics();

  return {
    stats: { gameStats: rawStats ? getGlobalGameStats(rawStats) : undefined },
    refresh: () => void refetch(),
    isLoading,
    isRefreshing: isRefetching,
  } as const;
};
