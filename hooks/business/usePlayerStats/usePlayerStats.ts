import { useGetPlayerStatistics } from '@/hooks/data/useGetPlayerStatistics/useGetPlayerStatistics';
import { Character } from '@/types/character';
import { CharacterStat, PlayerStats, StatisticName } from '@/types/stats';

const computeStats = (statistics: PlayerStats) => {
  const rankedMatchCount = statistics[StatisticName.RANKED_SEASON_MATCHES];
  const rankedWinCount = statistics[StatisticName.RANKED_SEASON_WINS];
  const rankedWinRate = rankedMatchCount ? (rankedWinCount / rankedMatchCount) * 100 : 0;

  const globalMatchCount = statistics[StatisticName.TOTAL_SESSIONS_PLAYED];
  const globalWinCount = statistics[StatisticName.BETA_WINS];
  const globalWinRate = globalMatchCount ? (globalWinCount / globalMatchCount) * 100 : 0;

  const gamesPlayedPerCharacter: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    value: statistics[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
  }));

  return {
    rankedElo: statistics[StatisticName.RANKED_SEASON_ELO],
    rankedMatchCount,
    rankedWinCount,
    rankedWinRate,

    globalMatchCount,
    globalWinCount,
    globalWinRate,

    gamesPlayedPerCharacter,
  };
};

export const usePlayerStats = () => {
  const { statistics, refetch, isLoading } = useGetPlayerStatistics();

  const stats = statistics && !isLoading ? computeStats(statistics) : undefined;

  return { stats, refresh: refetch, isLoading };
};
