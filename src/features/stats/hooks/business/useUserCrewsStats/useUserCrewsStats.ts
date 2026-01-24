import { type RefreshableState } from '@/types/loadableState';

import { type PlayerPosition, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

type UserCrewsStatsState = RefreshableState<{
  stats: {
    elo: number;
    setStats: {
      setCount: number;
    };
    bestWinStreak: number;
  } & Pick<PlayerPosition, 'position' | 'profile'>;
}>;

export const useUserCrewsStats = (): UserCrewsStatsState => {
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
    statisticName: StatisticName.CREWS_ELO,
  });

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

  if (rawStats && playerPositions) {
    const [userCrewsPosition] = playerPositions;
    return {
      ...baseState,
      stats: {
        elo: rawStats[StatisticName.CREWS_ELO] ? rawStats[StatisticName.CREWS_ELO] - 10000 : 1000,
        setStats: { setCount: rawStats[StatisticName.CREWS_SETS] ?? 0 },
        position: userCrewsPosition.position,
        profile: userCrewsPosition.profile,
        bestWinStreak: rawStats[StatisticName.CREWS_BEST_WIN_STREAK] ?? 0,
      },
    } as const;
  }

  if (isLoadingRawStats || isLoadingPlayerPosition) {
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
