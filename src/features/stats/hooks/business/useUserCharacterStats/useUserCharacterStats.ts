import { Character } from '@/types/character';

import { type PlayerStatistics, StatisticName, type UserData } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

const getCharacterStats = (rawStats: PlayerStatistics, userData: UserData) =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]] ?? 0,
    level: userData.characterData[character]?.lvl ?? 0,
  }));

export const useUserCharacterStats = () => {
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

  const stats = rawStats && userData ? getCharacterStats(rawStats, userData) : undefined;

  return { stats, refresh, isLoading, isRefreshing } as const;
};
