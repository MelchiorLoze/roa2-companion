import { Character } from './character';

export enum StatisticName {
  TOTAL_SESSIONS_PLAYED = 'TotalSessionsPlayed', // Total number of games played
  BETA_WINS = 'Beta Wins', // Total number of games won

  RANKED_SEASON_ELO = 'Ranked_SeasonElo',
  RANKED_SEASON_MATCHES = 'Ranked_SeasonMatches', // Total number of sets (bo3) played in ranked
  RANKED_SEASON_WINS = 'Ranked_SeasonWins', // Total number of sets (bo3) won in ranked

  CLA_MATCH_COUNT = 'Cla Match Count', // Total number of games played with Clairen
  ETA_MATCH_COUNT = 'Eta Match Count', // Total number of games played with Etalus
  FLE_MATCH_COUNT = 'Fle Match Count', // Total number of games played with Forsburn
  FOR_MATCH_COUNT = 'For Match Count', // Total number of games played with Forsburn
  KRA_MATCH_COUNT = 'Kra Match Count', // Total number of games played with Kragg
  LOX_MATCH_COUNT = 'Lox Match Count', // Total number of games played with Loxodont
  MAY_MATCH_COUNT = 'May Match Count', // Total number of games played with Maypul
  // OLY_MATCH_COUNT = 'Oly Match Count', // Total number of games played with Olympia
  ORC_MATCH_COUNT = 'Orc Match Count', // Total number of games played with Orcane
  RAN_MATCH_COUNT = 'Ran Match Count', // Total number of games played with Ranno
  WRA_MATCH_COUNT = 'Wra Match Count', // Total number of games played with Wrastor
  ZET_MATCH_COUNT = 'Zet Match Count', // Total number of games played with Zetterburn

  RANDOM_MATCH_COUNT = 'Random Match Count', // Total number of games played with random character
}

export type PlayerStats = Record<StatisticName, number>;

export type CharacterStat = {
  character: Character;
  value: number;
};
