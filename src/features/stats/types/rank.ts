import { type ImageSource } from 'expo-image';

import { Interval } from '@/utils/Interval';

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
} from '../assets/images/rank';

export const MAX_AETHEREAN_PLAYERS = 100; // Maximum number of players in the Aetherean rank

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

export const RANK_ELO_THRESHOLDS: Readonly<Record<Rank, number>> = Object.freeze({
  [Rank.STONE]: -Infinity,
  [Rank.BRONZE]: 500,
  [Rank.SILVER]: 700,
  [Rank.GOLD]: 900,
  [Rank.PLATINUM]: 1100,
  [Rank.DIAMOND]: 1300,
  [Rank.MASTER]: 1500,
  [Rank.GRANDMASTER]: 1700,
  [Rank.AETHEREAN]: 1800,
});

export const RANK_ELO_INTERVALS: Readonly<Record<Rank, Interval>> = Object.freeze({
  [Rank.STONE]: new Interval(RANK_ELO_THRESHOLDS[Rank.STONE], RANK_ELO_THRESHOLDS[Rank.BRONZE] - 1),
  [Rank.BRONZE]: new Interval(RANK_ELO_THRESHOLDS[Rank.BRONZE], RANK_ELO_THRESHOLDS[Rank.SILVER] - 1),
  [Rank.SILVER]: new Interval(RANK_ELO_THRESHOLDS[Rank.SILVER], RANK_ELO_THRESHOLDS[Rank.GOLD] - 1),
  [Rank.GOLD]: new Interval(RANK_ELO_THRESHOLDS[Rank.GOLD], RANK_ELO_THRESHOLDS[Rank.PLATINUM] - 1),
  [Rank.PLATINUM]: new Interval(RANK_ELO_THRESHOLDS[Rank.PLATINUM], RANK_ELO_THRESHOLDS[Rank.DIAMOND] - 1),
  [Rank.DIAMOND]: new Interval(RANK_ELO_THRESHOLDS[Rank.DIAMOND], RANK_ELO_THRESHOLDS[Rank.MASTER] - 1),
  [Rank.MASTER]: new Interval(RANK_ELO_THRESHOLDS[Rank.MASTER], RANK_ELO_THRESHOLDS[Rank.GRANDMASTER] - 1),
  [Rank.GRANDMASTER]: new Interval(RANK_ELO_THRESHOLDS[Rank.GRANDMASTER], RANK_ELO_THRESHOLDS[Rank.AETHEREAN] - 1),
  [Rank.AETHEREAN]: new Interval(RANK_ELO_THRESHOLDS[Rank.AETHEREAN], Infinity),
});

export type Leaderboard = {
  id: number;
  name: string;
  displayName: string;
  entryCount: number;
};

export type LeaderboardEntry = {
  steamId: number;
  position: number;
  elo: number;
};
