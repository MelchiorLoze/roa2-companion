import { useSeason } from '@/features/stats/contexts/SeasonContext/SeasonContext';
import { Character } from '@/types/character';
import { getRank } from '@/types/rank';

import {
  type CharacterStat,
  type PlayerPosition,
  StatisticName,
  type UserData,
  type UserStats,
} from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

const getRankedStats = (statistics: UserStats, userPosition: PlayerPosition, season: number) => {
  const rankedPosition = userPosition.position;
  const rankedElo =
    statistics[StatisticName[`RANKED_S${season}_ELO` as keyof typeof StatisticName] as keyof typeof statistics];
  const rankedSetCount =
    statistics[StatisticName[`RANKED_S${season}_SETS` as keyof typeof StatisticName] as keyof typeof statistics];
  const rankedWinCount =
    statistics[StatisticName[`RANKED_S${season}_WINS` as keyof typeof StatisticName] as keyof typeof statistics];
  const rankedWinRate = rankedSetCount ? (rankedWinCount / rankedSetCount) * 100 : 0;

  return {
    rankedPosition,
    rank: getRank(rankedElo, rankedPosition),
    rankedElo,
    rankedSetCount,
    rankedWinCount,
    rankedWinRate,
  };
};

const getGlobalStats = (statistics: UserStats) => {
  const globalGameCount = statistics[StatisticName.TOTAL_SESSIONS_PLAYED];
  const globalWinCount = statistics[StatisticName.BETA_WINS];
  const globalWinRate = globalGameCount ? (globalWinCount / globalGameCount) * 100 : 0;

  return { globalGameCount, globalWinCount, globalWinRate };
};

const getCharacterStats = (statistics: UserStats, userReadOnlyData: UserData) => {
  const characterStats: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    gameCount: statistics[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userReadOnlyData.characterData[character].lvl,
  }));

  return { characterStats };
};

export const useUserStats = () => {
  const { seasonIndex } = useSeason();
  const { statistics, refetch: refetchStatistics, isLoading: isStatisticsLoading } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPositions,
    isLoading: isPlayerPositionLoading,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: StatisticName[`RANKED_S${seasonIndex}_ELO` as keyof typeof StatisticName],
  });
  const { userData, refetch: refetchUserData, isLoading: isUserDataLoading } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchStatistics();
    void refetchPlayerPositions();
    void refetchUserData();
  };

  const isLoading = isStatisticsLoading || isPlayerPositionLoading || isUserDataLoading;

  const stats =
    statistics && userRankedPosition && userData && !isLoading
      ? {
          ...getRankedStats(statistics, userRankedPosition, seasonIndex),
          ...getGlobalStats(statistics),
          ...getCharacterStats(statistics, userData),
        }
      : undefined;

  return { stats, refresh, isLoading };
};
