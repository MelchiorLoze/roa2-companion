import { Character } from '@/types/character';
import { type RefreshableState } from '@/types/loadableState';

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

type UserGlobalStats = RefreshableState<{
  stats: {
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
}>;

export const useUserGlobalStats = (): UserGlobalStats => {
  const {
    statistics: rawStats,
    isLoading: isLoadingRawStats,
    isRefetching: isRefetchingRawStats,
    refetch: refetchPlayerStatistics,
  } = useGetPlayerStatistics();
  const {
    userData,
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

  if (rawStats && userData) {
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
