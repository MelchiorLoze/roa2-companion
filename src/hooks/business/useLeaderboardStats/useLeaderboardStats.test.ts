import { renderHook } from '@testing-library/react-native';

import { useCommunityLeaderboard } from '@/hooks/data/useCommunityLeaderboard/useCommunityLeaderboard';
import { useCommunityLeaderboards } from '@/hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';

import { useLeaderboardStats } from './useLeaderboardStats';

jest.mock('@/hooks/data/useCommunityLeaderboards/useCommunityLeaderboards');
const useCommunityLeaderboardsMock = jest.mocked(useCommunityLeaderboards);
const defaultCommunityLeaderboardsState: ReturnType<typeof useCommunityLeaderboards> = {
  leaderboards: [
    { id: 123, name: 'season_1', displayName: 'Season 1', entryCount: 100 },
    { id: 456, name: 'season_2', displayName: 'Season 2', entryCount: 200 },
    { id: 789, name: 'season_3', displayName: 'Season 3', entryCount: 300 },
  ],
  isLoading: false,
  isError: false,
};

jest.mock('@/hooks/data/useCommunityLeaderboard/useCommunityLeaderboard');
const useCommunityLeaderboardMock = jest.mocked(useCommunityLeaderboard);
const defaultCommunityLeaderboardState: ReturnType<typeof useCommunityLeaderboard> = {
  leaderboardEntries: [],
  isLoading: false,
  isError: false,
};

const renderUseLeaderboardStats = (...props: Parameters<typeof useLeaderboardStats>) => {
  const { result } = renderHook(() => useLeaderboardStats(...props));

  expect(useCommunityLeaderboardsMock).toHaveBeenCalledTimes(1);
  expect(useCommunityLeaderboardMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useLeaderboardStats', () => {
  beforeEach(() => {
    useCommunityLeaderboardsMock.mockReturnValue(defaultCommunityLeaderboardsState);
    useCommunityLeaderboardMock.mockReturnValue(defaultCommunityLeaderboardState);
  });

  it('returns correct values when leaderboards are loading', () => {
    useCommunityLeaderboardsMock.mockReturnValue({
      ...defaultCommunityLeaderboardsState,
      leaderboards: [],
      isLoading: true,
    });

    const { result } = renderUseLeaderboardStats(1000);

    expect(useCommunityLeaderboardMock).toHaveBeenCalledWith(undefined);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.firstPlayerElo).toBe(0);
    expect(result.current.lastPlayerElo).toBe(0);
    expect(result.current.lastAethereanElo).toBe(0);
    expect(result.current.rankDistribution).toEqual([]);
    expect(result.current.eloDistribution).toEqual([{ value: 0, elo: 0 }]);
  });

  it('returns correct values when leaderboard entries are loading', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardState,
      isLoading: true,
    });

    const { result } = renderUseLeaderboardStats(1000);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.firstPlayerElo).toBe(0);
    expect(result.current.lastPlayerElo).toBe(0);
    expect(result.current.lastAethereanElo).toBe(0);
    expect(result.current.rankDistribution).toEqual([]);
    expect(result.current.eloDistribution).toEqual([{ value: 0, elo: 0 }]);
  });

  it('fetches leaderboard from last leaderboards id', () => {
    renderUseLeaderboardStats(1000);

    expect(useCommunityLeaderboardMock).toHaveBeenCalledWith(789);
  });

  it('matches snapshot for complete for leaderboard', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardsState,
      leaderboardEntries: [
        // Aetherean
        { steamId: 1, position: 1, elo: 2162 },
        { steamId: 2, position: 2, elo: 2089 },
        { steamId: 3, position: 3, elo: 1910 },
        { steamId: 4, position: 4, elo: 1837 },
        // Grandmaster
        { steamId: 5, position: 5, elo: 1791 },
        // Master
        { steamId: 6, position: 6, elo: 1655 },
        { steamId: 7, position: 7, elo: 1649 },
        { steamId: 8, position: 8, elo: 1523 },
        // Diamond
        { steamId: 9, position: 9, elo: 1450 },
        { steamId: 10, position: 10, elo: 1300 },
        // Platinum
        { steamId: 11, position: 11, elo: 1258 },
        { steamId: 12, position: 12, elo: 1111 },
        // Gold
        { steamId: 13, position: 13, elo: 1000 },
        { steamId: 14, position: 14, elo: 920 },
        // Silver
        { steamId: 15, position: 15, elo: 820 },
        { steamId: 16, position: 16, elo: 752 },
        // Bronze
        { steamId: 17, position: 17, elo: 699 },
        { steamId: 18, position: 18, elo: 510 },
        // Stone
        { steamId: 19, position: 19, elo: 400 },
        { steamId: 20, position: 20, elo: 300 },
        { steamId: 25, position: 25, elo: -100 },
      ],
    });

    const { result } = renderUseLeaderboardStats(1000);

    expect(result.current).toMatchSnapshot();
  });

  it('returns 0 as lastPlayerElo when it is above 0', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardState,
      leaderboardEntries: [
        { steamId: 1, position: 1, elo: 1000 },
        { steamId: 2, position: 2, elo: 50 },
      ],
    });

    const { result } = renderUseLeaderboardStats(1000);

    expect(result.current.lastPlayerElo).toBe(0);
  });
});
