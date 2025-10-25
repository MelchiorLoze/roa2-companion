import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

const getCrewsStats = (rawStats: PlayerStatistics) => {
  const elo = rawStats[StatisticName.CREWS_ELO] ? rawStats[StatisticName.CREWS_ELO] - 10000 : 1000;
  const setCount = rawStats[StatisticName.CREWS_SETS] ?? 0;

  return { elo, setStats: { setCount } } as const;
};

export const useUserCrewsStats = () => {
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
  } = useGetPlayerStatistics();
  const {
    playerPositions: [userCrewsPosition],
    refetch: refetchPlayerPosition,
    isLoading: isLoadingPlayerPosition,
    isRefetching: isRefetchingPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: StatisticName.CREWS_ELO,
  });

  const isLoading = isLoadingRawStats || isLoadingPlayerPosition;
  const isRefreshing = isRefetchingRawStats || isRefetchingPlayerPosition;

  const refresh = () => {
    void refetchPlayerStatistics();
    void refetchPlayerPosition();
  };

  return {
    stats: {
      ...(rawStats ? getCrewsStats(rawStats) : {}),
      position: userCrewsPosition?.position,
      profile: userCrewsPosition?.profile,
    },
    refresh,
    isLoading,
    isRefreshing,
  } as const;
};
