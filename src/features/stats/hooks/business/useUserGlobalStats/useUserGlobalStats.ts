import { Character } from '@/types/character';

import { type PlayerStatistics, StatisticName, type UserData } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

const getGlobalGameStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_GAMES] ?? 0;
  const winCount = rawStats[StatisticName.TOTAL_WINS] ?? 0;
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameCount, winCount, winRate } as const;
};

const getGlobalCharacterStats = (rawStats: PlayerStatistics, userData: UserData) =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]] ?? 0,
    level: userData.characterData[character]?.lvl ?? 0,
  }));

export const useUserGlobalStats = () => {
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
  } = useGetPlayerStatistics();
  const {
    userData,
    refetch: refetchUserData,
    isLoading: isLoadingUserData,
    isRefetching: isRefetchingUserData,
  } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchPlayerStatistics();
    void refetchUserData();
  };

  const isLoading = isLoadingRawStats || isLoadingUserData;
  const isRefreshing = isRefetchingRawStats || isRefetchingUserData;

  return {
    stats: {
      gameStats: rawStats ? getGlobalGameStats(rawStats) : undefined,
      characterStats: userData && rawStats ? getGlobalCharacterStats(rawStats, userData) : undefined,
    },
    refresh,
    isLoading,
    isRefreshing,
  } as const;
};
