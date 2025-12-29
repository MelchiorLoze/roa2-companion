import { Rank } from '../types/rank';
import { getRank } from './getRank';

describe('getRank', () => {
  it('returns the correct rank for a given elo and leaderboard position', () => {
    expect(getRank(-100, 50)).toBe(Rank.STONE);
    expect(getRank(0, 50)).toBe(Rank.STONE);
    expect(getRank(499, 50)).toBe(Rank.STONE);

    expect(getRank(500, 50)).toBe(Rank.BRONZE);
    expect(getRank(600, 50)).toBe(Rank.BRONZE);
    expect(getRank(699, 50)).toBe(Rank.BRONZE);

    expect(getRank(700, 50)).toBe(Rank.SILVER);
    expect(getRank(800, 50)).toBe(Rank.SILVER);
    expect(getRank(899, 50)).toBe(Rank.SILVER);

    expect(getRank(900, 50)).toBe(Rank.GOLD);
    expect(getRank(1000, 50)).toBe(Rank.GOLD);
    expect(getRank(1099, 50)).toBe(Rank.GOLD);

    expect(getRank(1100, 50)).toBe(Rank.PLATINUM);
    expect(getRank(1200, 50)).toBe(Rank.PLATINUM);
    expect(getRank(1299, 50)).toBe(Rank.PLATINUM);

    expect(getRank(1300, 50)).toBe(Rank.DIAMOND);
    expect(getRank(1400, 50)).toBe(Rank.DIAMOND);
    expect(getRank(1499, 50)).toBe(Rank.DIAMOND);

    expect(getRank(1500, 50)).toBe(Rank.MASTER);
    expect(getRank(1600, 50)).toBe(Rank.MASTER);
    expect(getRank(1699, 50)).toBe(Rank.MASTER);

    expect(getRank(1700, 50)).toBe(Rank.GRANDMASTER);
    expect(getRank(1799, 50)).toBe(Rank.GRANDMASTER);
    expect(getRank(1900, 101)).toBe(Rank.GRANDMASTER);

    expect(getRank(1900, 100)).toBe(Rank.AETHEREAN);
    expect(getRank(1800, 50)).toBe(Rank.AETHEREAN);
    expect(getRank(2000, 50)).toBe(Rank.AETHEREAN);
  });
});
