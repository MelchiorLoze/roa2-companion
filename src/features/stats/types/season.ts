export const MIN_SEASON_INDEX = 1;

export type Season = Readonly<{
  index: number;
  name: string;
  isFirst: boolean;
  isLast: boolean;
}>;
