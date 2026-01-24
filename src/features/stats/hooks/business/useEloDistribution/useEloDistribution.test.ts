import { renderHook } from '@testing-library/react-native';

import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';
import { useEloDistribution } from './useEloDistribution';

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

const renderUseEloDistribution = () => {
  const { result } = renderHook(useEloDistribution);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useEloDistribution', () => {
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

    const { result } = renderUseEloDistribution();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.eloDistribution).toBeUndefined();
  });

  it('returns correct elo distribution for complete leaderboard', () => {
    const { result } = renderUseEloDistribution();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.eloDistribution).toMatchSnapshot();
  });

  it('returns error state when leaderboard stats have error', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsReturnValue,
      firstPlayerElo: undefined,
      lastPlayerElo: undefined,
      lastAethereanElo: undefined,
      leaderboardEntries: undefined,
      isLoading: false,
      isError: true,
    });

    const { result } = renderUseEloDistribution();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.eloDistribution).toBeUndefined();
  });
});
