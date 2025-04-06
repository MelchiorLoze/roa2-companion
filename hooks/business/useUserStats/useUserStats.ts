import { useGetPlayerStatistics, useGetUserReadOnlyData } from '@/hooks/data';
import { Character } from '@/types/character';
import { CharacterStat, StatisticName, UserData, UserStats } from '@/types/stats';

const computeStats = (statistics: UserStats, userReadOnlyData: UserData) => {
  const rankedSetCount = statistics[StatisticName.RANKED_S2_SETS];
  const rankedWinCount = statistics[StatisticName.RANKED_S2_WINS];
  const rankedWinRate = rankedSetCount ? (rankedWinCount / rankedSetCount) * 100 : 0;

  const globalGameCount = statistics[StatisticName.TOTAL_SESSIONS_PLAYED];
  const globalWinCount = statistics[StatisticName.BETA_WINS];
  const globalWinRate = globalGameCount ? (globalWinCount / globalGameCount) * 100 : 0;

  const characterStats: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    gameCount: statistics[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userReadOnlyData.characterData[character].lvl,
  }));

  return {
    rankedElo: statistics[StatisticName.RANKED_S2_ELO],
    rankedSetCount,
    rankedWinCount,
    rankedWinRate,

    globalMatchCount: globalGameCount,
    globalWinCount,
    globalWinRate,

    characterStats,
  };
};

export const useUserStats = () => {
  const { statistics, refetch: refetchStatistics, isLoading: isStatisticsLoading } = useGetPlayerStatistics();
  const { userData, refetch: refetchUserData, isLoading: isUserDataLoading } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchStatistics();
    void refetchUserData();
  };

  const isLoading = isStatisticsLoading || isUserDataLoading;

  const stats = statistics && userData && !isLoading ? computeStats(statistics, userData) : undefined;

  return { stats, refresh, isLoading };
};
