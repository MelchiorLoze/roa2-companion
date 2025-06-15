import { Character } from '@/types/character';
import { getRank } from '@/types/rank';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
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

const getStatNameFromSeason = (stat: 'ELO' | 'SETS' | 'WINS', seasonIndex: number) => {
  const key = `RANKED_S${seasonIndex}_${stat}` as keyof typeof StatisticName;

  if (!(key in StatisticName)) throw new Error(`Ranked stat name for ${stat} in season ${seasonIndex} does not exist.`);

  return StatisticName[key];
};

const getRankedStats = (rawStats: UserStats, userPosition: PlayerPosition, seasonIndex: number) => {
  const rankedPosition = userPosition.position;
  const rankedElo = rawStats[getStatNameFromSeason('ELO', seasonIndex)];
  const rankedSetCount = rawStats[getStatNameFromSeason('SETS', seasonIndex)];
  const rankedWinCount = rawStats[getStatNameFromSeason('WINS', seasonIndex)];
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

const getGlobalStats = (rawStats: UserStats) => {
  const globalGameCount = rawStats[StatisticName.TOTAL_SESSIONS_PLAYED];
  const globalWinCount = rawStats[StatisticName.BETA_WINS];
  const globalWinRate = globalGameCount ? (globalWinCount / globalGameCount) * 100 : 0;

  return { globalGameCount, globalWinCount, globalWinRate };
};

const getCharacterStats = (rawStats: UserStats, userData: UserData) => {
  const characterStats: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userData.characterData[character].lvl,
  }));

  return { characterStats };
};

export const useUserStats = () => {
  const { season } = useSeason();
  const { statistics: rawStats, refetch: refetchStatistics, isLoading: isLoadingRawStats } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPositions,
    isLoading: isLoadingPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: getStatNameFromSeason('ELO', season.index),
  });
  const { userData, refetch: refetchUserData, isLoading: isLoadingUserData } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchStatistics();
    void refetchPlayerPositions();
    void refetchUserData();
  };

  const isLoading = isLoadingRawStats || isLoadingPlayerPosition || isLoadingUserData;

  const stats =
    rawStats && userRankedPosition && userData && !isLoading
      ? {
          ...getRankedStats(rawStats, userRankedPosition, season.index),
          ...getGlobalStats(rawStats),
          ...getCharacterStats(rawStats, userData),
        }
      : undefined;

  return { stats, refresh, isLoading };
};
