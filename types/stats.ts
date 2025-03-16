export enum StatisticName {
  TOTAL_SESSIONS_PLAYED = 'TotalSessionsPlayed',
  BETA_WINS = 'Beta Wins',

  RANKED_SEASON_ELO = 'Ranked_SeasonElo',
  RANKED_SEASON_MATCHES = 'Ranked_SeasonMatches',
  RANKED_SEASON_WINS = 'Ranked_SeasonWins',

  CLA_MATCH_COUNT = 'Cla Match Count',
  ETA_MATCH_COUNT = 'Eta Match Count',
  FLE_MATCH_COUNT = 'Fle Match Count',
  FOR_MATCH_COUNT = 'For Match Count',
  KRA_MATCH_COUNT = 'Kra Match Count',
  LOX_MATCH_COUNT = 'Lox Match Count',
  MAY_MATCH_COUNT = 'May Match Count',
  //OLY_MATCH_COUNT = 'Oly Match Count',
  ORC_MATCH_COUNT = 'Orc Match Count',
  RAN_MATCH_COUNT = 'Ran Match Count',
  WRA_MATCH_COUNT = 'Wra Match Count',
  ZET_MATCH_COUNT = 'Zet Match Count',

  RANDOM_MATCH_COUNT = 'Random Match Count',
}

export type PlayerStats = Record<StatisticName, number>;
