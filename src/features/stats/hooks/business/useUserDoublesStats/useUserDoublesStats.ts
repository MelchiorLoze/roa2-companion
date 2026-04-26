import { type RefreshableState } from '@/types/loadableState';

import { type PlayerPosition, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

type UserDoublesStatsState = RefreshableState<{
  stats: {
    elo: number;
    setStats: {
      setCount: number;
    };
    bestWinStreak: number;
  } & Pick<PlayerPosition, 'position' | 'profile'>;
}>;

export const useUserDoublesStats = (): UserDoublesStatsState => {
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
    statisticName: StatisticName.DOUBLES_ELO,
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
    const [userDoublesPosition] = playerPositions;
    return {
      ...baseState,
      stats: {
        elo: rawStats[StatisticName.DOUBLES_ELO] ? rawStats[StatisticName.DOUBLES_ELO] - 10000 : 1000,
        setStats: { setCount: rawStats[StatisticName.DOUBLES_SETS] ?? 0 },
        position: userDoublesPosition.position,
        profile: userDoublesPosition.profile,
        bestWinStreak: rawStats[StatisticName.DOUBLES_BEST_WIN_STREAK] ?? 0,
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
