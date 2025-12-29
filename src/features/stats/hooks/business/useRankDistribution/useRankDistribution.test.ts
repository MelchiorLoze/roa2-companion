import { renderHook } from '@testing-library/react-native';

import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { Rank } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';
import { useRankDistribution } from './useRankDistribution';

jest.mock('../useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsValue = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

const renderUseRankDistribution = () => {
  const { result } = renderHook(useRankDistribution);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useRankDistribution', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsValue);
  });

  it('returns correct values when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsValue,
      firstPlayerElo: 0,
      lastPlayerElo: 0,
      lastAethereanElo: 0,
      leaderboardEntries: [],
      isLoading: true,
    });

    const { result } = renderUseRankDistribution();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rankDistribution).toEqual({
      [Rank.STONE]: 0,
      [Rank.BRONZE]: 0,
      [Rank.SILVER]: 0,
      [Rank.GOLD]: 0,
      [Rank.PLATINUM]: 0,
      [Rank.DIAMOND]: 0,
      [Rank.MASTER]: 0,
      [Rank.GRANDMASTER]: 0,
      [Rank.AETHEREAN]: 0,
    });
  });

  it('returns correct elo distribution for complete leaderboard', () => {
    const { result } = renderUseRankDistribution();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rankDistribution).toEqual({
      [Rank.STONE]: 3,
      [Rank.BRONZE]: 2,
      [Rank.SILVER]: 2,
      [Rank.GOLD]: 2,
      [Rank.PLATINUM]: 3,
      [Rank.DIAMOND]: 1,
      [Rank.MASTER]: 3,
      [Rank.GRANDMASTER]: 1,
      [Rank.AETHEREAN]: 4,
    });
  });
});
