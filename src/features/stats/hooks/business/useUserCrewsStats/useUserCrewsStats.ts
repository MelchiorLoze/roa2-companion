import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

const getCrewsStats = (rawStats: PlayerStatistics) => {
  const elo = rawStats[StatisticName.CREWS_ELO] ? rawStats[StatisticName.CREWS_ELO] - 10000 : 1000;
  const setCount = rawStats[StatisticName.CREWS_SETS] ?? 0;

  return { elo, setStats: { setCount } } as const;
};

export const useUserCrewsStats = () => {
  const { statistics: rawStats, refetch, isLoading, isRefetching } = useGetPlayerStatistics();

  return {
    stats: rawStats ? getCrewsStats(rawStats) : undefined,
    refresh: () => void refetch(),
    isLoading,
    isRefreshing: isRefetching,
  } as const;
};
