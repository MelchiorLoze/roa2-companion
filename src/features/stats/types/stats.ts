import { type Character } from '@/types/character';

// Cannot determine current season dynamically for now as ranked stats names
// are inconsistent per season
export const MIN_SEASON_INDEX = 1;
export const MAX_SEASON_INDEX = 3;

export enum StatisticName {
  // Ranked
  RANKED_SEASON_INDEX = 'Ranked_SeasonIndex',

  // The following numbers are counted in number of SETS (bo3)
  RANKED_S1_ELO = 'Ranked_SeasonElo',
  RANKED_S1_SETS = 'Ranked_SeasonMatches',
  RANKED_S1_WINS = 'Ranked_SeasonWins',

  RANKED_S2_ELO = 'Ranked_SeasonElo_2',
  RANKED_S3_ELO = 'Ranked_SeasonElo_3',

  RANKED_SETS = 'Ranked_Matches',
  RANKED_WINS = 'Ranked_Wins',

  // General
  // The following numbers are counted in number of GAMES (bo1)
  TOTAL_SESSIONS_PLAYED = 'TotalSessionsPlayed',
  BETA_WINS = 'Beta Wins',

  ABS_MATCH_COUNT = 'Abs Match Count',
  CLA_MATCH_COUNT = 'Cla Match Count',
  ETA_MATCH_COUNT = 'Eta Match Count',
  FLE_MATCH_COUNT = 'Fle Match Count',
  FOR_MATCH_COUNT = 'For Match Count',
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
  playerName: string;
  statisticName: StatisticName;
  statisticValue: number;
  position: number;
}>;

export type PlayerStatistics = Partial<Record<StatisticName, number>>;

export type UserData = DeepReadonly<{
  characterData: Record<Character, { lvl: number } | undefined>;
}>;
