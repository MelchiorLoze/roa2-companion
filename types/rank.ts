import { ImageSource } from 'expo-image';

import {
  AethereanIcon,
  BronzeIcon,
  DiamondIcon,
  GoldIcon,
  GrandmasterIcon,
  MasterIcon,
  PlatinumIcon,
  SilverIcon,
  StoneIcon,
} from '@/assets/images';
import { Interval } from '@/utils/Interval';

export enum Rank {
  STONE = 'stone',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  MASTER = 'master',
  GRANDMASTER = 'grandmaster',
  AETHEREAN = 'aetherean',
}

export const RANK_ICONS: Readonly<Record<Rank, ImageSource>> = Object.freeze({
  [Rank.STONE]: StoneIcon,
  [Rank.BRONZE]: BronzeIcon,
  [Rank.SILVER]: SilverIcon,
  [Rank.GOLD]: GoldIcon,
  [Rank.PLATINUM]: PlatinumIcon,
  [Rank.DIAMOND]: DiamondIcon,
  [Rank.MASTER]: MasterIcon,
  [Rank.GRANDMASTER]: GrandmasterIcon,
  [Rank.AETHEREAN]: AethereanIcon,
});

enum RankThreshold {
  STONE = -Infinity,
  BRONZE = 500,
  SILVER = 700,
  GOLD = 900,
  PLATINUM = 1100,
  DIAMOND = 1300,
  MASTER = 1500,
  GRANDMASTER = 1700,
  AETHEREAN = 1800,
}

export const RANK_ELO_INTERVALS: Readonly<Record<Rank, Interval>> = Object.freeze({
  [Rank.STONE]: new Interval(RankThreshold.STONE, RankThreshold.BRONZE - 1),
  [Rank.BRONZE]: new Interval(RankThreshold.BRONZE, RankThreshold.SILVER - 1),
  [Rank.SILVER]: new Interval(RankThreshold.SILVER, RankThreshold.GOLD - 1),
  [Rank.GOLD]: new Interval(RankThreshold.GOLD, RankThreshold.PLATINUM - 1),
  [Rank.PLATINUM]: new Interval(RankThreshold.PLATINUM, RankThreshold.DIAMOND - 1),
  [Rank.DIAMOND]: new Interval(RankThreshold.DIAMOND, RankThreshold.MASTER - 1),
  [Rank.MASTER]: new Interval(RankThreshold.MASTER, RankThreshold.GRANDMASTER - 1),
  [Rank.GRANDMASTER]: new Interval(RankThreshold.GRANDMASTER, RankThreshold.AETHEREAN - 1),
  [Rank.AETHEREAN]: new Interval(RankThreshold.AETHEREAN, Infinity),
});

export const getRank = (elo: number, leaderboardPosition: number) => {
  const rank = Object.keys(RANK_ELO_INTERVALS).find((key) => RANK_ELO_INTERVALS[key as Rank].contains(elo)) as Rank;
  if (rank === Rank.AETHEREAN && leaderboardPosition > 100) return Rank.GRANDMASTER; // Aetherean rank is only for top 100 players
  return rank;
};
