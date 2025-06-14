import { StatisticName } from '@/features/stats/types/stats';

import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';

export const useCurrentSeasonIndex = () => {
  const { statistics } = useGetPlayerStatistics();

  return {
    currentSeasonIndex: statistics?.[StatisticName.RANKED_SEASON_INDEX],
  };
};
