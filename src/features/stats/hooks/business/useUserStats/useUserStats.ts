import { Character } from '@/types/character';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { getRank } from '../../../types/rank';
import { type PlayerPosition, type PlayerStatistics, StatisticName, type UserData } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

const getStatNameFromSeason = (stat: 'ELO' | 'SETS' | 'WINS', seasonIndex: number) => {
  const key = `RANKED_S${seasonIndex}_${stat}` as keyof typeof StatisticName;

  if (!(key in StatisticName)) throw new Error(`Ranked stat name for ${stat} in season ${seasonIndex} does not exist.`);

  return StatisticName[key];
};

const getRankedStats = (rawStats: PlayerStatistics, userPosition: PlayerPosition, seasonIndex: number) => {
  const position = userPosition.position;
  const elo = rawStats[getStatNameFromSeason('ELO', seasonIndex)];
  const setCount = rawStats[getStatNameFromSeason('SETS', seasonIndex)];
  const winCount = rawStats[getStatNameFromSeason('WINS', seasonIndex)];
  const winRate = setCount ? (winCount / setCount) * 100 : 0;

  return {
    position,
    rank: getRank(elo, position),
    elo,
    setCount,
    winCount,
    winRate,
  };
};

const getGlobalStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_SESSIONS_PLAYED];
  const winCount = rawStats[StatisticName.BETA_WINS];
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameCount, winCount, winRate };
};

const getCharacterStats = (rawStats: PlayerStatistics, userData: UserData) =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userData.characterData[character].lvl,
  }));

export const useUserStats = () => {
  const { season } = useSeason();
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
  } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPosition,
    isLoading: isLoadingPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: getStatNameFromSeason('ELO', season.index),
  });
  const { userData, refetch: refetchUserData, isLoading: isLoadingUserData } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchPlayerStatistics();
    void refetchPlayerPosition();
    void refetchUserData();
  };

  const isLoading = isLoadingRawStats || isLoadingPlayerPosition || isLoadingUserData;

  const rankedStats =
    rawStats && userRankedPosition && !isLoading
      ? getRankedStats(rawStats, userRankedPosition, season.index)
      : undefined;
  const globalStats = rawStats && !isLoading ? getGlobalStats(rawStats) : undefined;
  const characterStats = rawStats && userData && !isLoading ? getCharacterStats(rawStats, userData) : undefined;

  return { rankedStats, globalStats, characterStats, refresh, isLoading };
};
