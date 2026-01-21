import { renderHook } from '@testing-library/react-native';

import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { Rank } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';
import { useRankDistribution } from './useRankDistribution';

jest.mock('../useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsReturnValue: ReturnType<typeof useLeaderboardStats> = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
  isError: false,
};

const renderUseRankDistribution = () => {
  const { result } = renderHook(useRankDistribution);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useRankDistribution', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsReturnValue);
  });

  it('returns correct values when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsReturnValue,
      firstPlayerElo: undefined,
      lastPlayerElo: undefined,
      lastAethereanElo: undefined,
      leaderboardEntries: undefined,
      isLoading: true,
    });

    const { result } = renderUseRankDistribution();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rankDistribution).toBeUndefined();
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
