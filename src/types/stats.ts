import type { Character } from './character';

export enum StatisticName {
  // Ranked
  // The following numbers are counted in number of SETS (bo3)
  RANKED_SEASON_INDEX = 'Ranked_SeasonIndex',

  RANKED_S1_ELO = 'Ranked_SeasonElo',
  RANKED_S1_SETS = 'Ranked_SeasonMatches',
  RANKED_S1_WINS = 'Ranked_SeasonWins',

  RANKED_S2_ELO = 'Ranked_SeasonEloPure_2',
  RANKED_S2_SETS = 'Ranked_Matches',
  RANKED_S2_WINS = 'Ranked_Wins',

  // General
  // The following numbers are counted in number of GAMES (bo1)
  TOTAL_SESSIONS_PLAYED = 'TotalSessionsPlayed',
  BETA_WINS = 'Beta Wins',

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

export type PlayerPosition = {
  playerName: string;
  statisticName: StatisticName;
  statisticValue: number;
  position: number;
};

export type UserStats = Record<StatisticName, number>;

export type UserData = { characterData: Record<Character, { lvl: number }> };

export type CharacterStat = {
  character: Character;
  gameCount: number;
  level: number;
};
