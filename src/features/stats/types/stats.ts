import { type Character } from '@/types/character';

export enum StatisticName {
  /*
   * RANKED STATS
   * The following numbers are counted in number of SETS (bo3)
   */

  RANKED_SEASON_INDEX = 'Ranked_SeasonIndex',

  RANKED_S1_ELO = 'Ranked_SeasonElo',
  RANKED_S1_SETS = 'Ranked_SeasonMatches',
  RANKED_S1_WINS = 'Ranked_SeasonWins',

  RANKED_S2_ELO = 'Ranked_SeasonEloPure_2',
  RANKED_S3_ELO = 'Ranked_SeasonEloPure_3',
  RANKED_S4_ELO = 'Ranked_SeasonEloPure_4',

  RANKED_SETS = 'Ranked_Matches',
  RANKED_WINS = 'Ranked_Wins',
  RANKED_BEST_WIN_STREAK = 'Ranked_PeakWinStreak',

  /*
   * CREWS STATS
   * The following numbers are counted in number of SETS (bo3)
   */

  CREWS_ELO = 'Crews_Elo',
  CREWS_SETS = 'Crews_Matches',

  /*
   * GENERAL STATS
   * The following numbers are counted in number of GAMES (bo1)
   */

  TOTAL_GAMES = 'TotalSessionsPlayed',
  TOTAL_WINS = 'Beta Wins',

  ABS_MATCH_COUNT = 'Abs Match Count',
  CLA_MATCH_COUNT = 'Cla Match Count',
  ETA_MATCH_COUNT = 'Eta Match Count',
  FLE_MATCH_COUNT = 'Fle Match Count',
  FOR_MATCH_COUNT = 'For Match Count',
  GAL_MATCH_COUNT = 'Gal Match Count',
  KRA_MATCH_COUNT = 'Kra Match Count',
  LOX_MATCH_COUNT = 'Lox Match Count',
  MAY_MATCH_COUNT = 'May Match Count',
  OLY_MATCH_COUNT = 'Oly Match Count',
  ORC_MATCH_COUNT = 'Orc Match Count',
  RAN_MATCH_COUNT = 'Ran Match Count',
  WRA_MATCH_COUNT = 'Wra Match Count',
  ZET_MATCH_COUNT = 'Zet Match Count',

  RANDOM_MATCH_COUNT = 'Random Match Count',
}

export type PlayerPosition = Readonly<{
  statisticName: StatisticName;
  statisticValue: number;
  position: number;
  profile: {
    playerName: string;
    avatarUrl: URL;
  };
}>;

export type PlayerStatistics = Partial<Record<StatisticName, number>>;

export type UserData = DeepReadonly<{
  characterData: Record<Character, { lvl: number } | undefined>;
}>;
