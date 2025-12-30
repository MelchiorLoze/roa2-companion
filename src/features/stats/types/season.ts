// Cannot determine current season dynamically for now as ranked stats names
// are inconsistent per season
export const MIN_SEASON_INDEX = 1;
export const MAX_SEASON_INDEX = 5;

export type Season = Readonly<{
  index: number;
  name: string;
  isFirst: boolean;
  isLast: boolean;
}>;
