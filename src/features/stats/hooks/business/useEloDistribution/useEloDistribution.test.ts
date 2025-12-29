import { renderHook } from '@testing-library/react-native';

import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';
import { useEloDistribution } from './useEloDistribution';

jest.mock('../useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsValue = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

const renderUseEloDistribution = () => {
  const { result } = renderHook(useEloDistribution);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useEloDistribution', () => {
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

    const { result } = renderUseEloDistribution();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.eloDistribution).toEqual({});
  });

  it('returns correct elo distribution for complete leaderboard', () => {
    const { result } = renderUseEloDistribution();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.eloDistribution).toMatchSnapshot();
  });
});
