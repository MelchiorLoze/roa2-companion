import { StatisticName } from '@/features/stats/types/stats';
import type { LoadableState } from '@/types/loadableState';

import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

export const useCurrentSeasonIndex = (): LoadableState<{ currentSeasonIndex: number }> => {
  const { statistics, isLoading } = useGetPlayerStatistics();

  const baseState = {
    currentSeasonIndex: undefined,
    isLoading: false,
    isError: false,
  } as const;

  if (statistics) {
    return {
      ...baseState,
      currentSeasonIndex: statistics[StatisticName.RANKED_SEASON_INDEX],
    };
  }

  if (isLoading) {
    return {
      ...baseState,
      isLoading: true,
    };
  }

  return {
    ...baseState,
    isError: true,
  };
};
