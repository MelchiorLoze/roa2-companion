import { Character } from '@/types/character';
import { type RefreshableState } from '@/types/loadableState';

import { type PlayerStatistics, StatisticName, type UserData } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

type UserGlobalStats = {
  gameStats: {
    gameCount: number;
    winCount: number;
    winRate: number;
  };
  characterStats: {
    character: Character;
    gameCount: number;
    level: number;
  }[];
};

const getGlobalGameStats = (rawStats: PlayerStatistics): UserGlobalStats['gameStats'] => {
  const gameCount = rawStats[StatisticName.TOTAL_GAMES] ?? 0;
  const winCount = rawStats[StatisticName.TOTAL_WINS] ?? 0;
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameCount, winCount, winRate } as const;
};

const getGlobalCharacterStats = (rawStats: PlayerStatistics, userData: UserData): UserGlobalStats['characterStats'] =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]] ?? 0,
    level: userData.characterData[character]?.lvl ?? 0,
  }));

export const useUserGlobalStats = (): RefreshableState<'stats', UserGlobalStats> => {
  const {
    statistics: rawStats,
    isSuccess: isSuccessRawStats,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
    refetch: refetchPlayerStatistics,
  } = useGetPlayerStatistics();
  const {
    userData,
    isSuccess: isSuccessUserData,
    isLoading: isLoadingUserData,
    isRefetching: isRefetchingUserData,
    refetch: refetchUserData,
  } = useGetUserReadOnlyData();

  const baseState = {
    stats: undefined,
    isLoading: false,
    isError: false,
    isRefreshing: isRefetchingRawStats || isRefetchingUserData,
    refresh: () => {
      void refetchPlayerStatistics();
      void refetchUserData();
    },
  } as const;

  if (isSuccessRawStats && isSuccessUserData && rawStats && userData) {
    return {
      ...baseState,
      stats: {
        gameStats: getGlobalGameStats(rawStats),
        characterStats: getGlobalCharacterStats(rawStats, userData),
      },
    } as const;
  }

  if (isLoadingRawStats || isLoadingUserData) {
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
