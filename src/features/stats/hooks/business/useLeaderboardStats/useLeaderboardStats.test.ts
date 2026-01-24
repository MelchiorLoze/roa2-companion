import { renderHook } from '@testing-library/react-native';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { useCommunityLeaderboard } from '../../data/useCommunityLeaderboard/useCommunityLeaderboard';
import { useLeaderboardStats } from './useLeaderboardStats';

jest.mock('../../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const defaultSeasonReturnValue: ReturnType<typeof useSeason> = {
  season: {
    index: 1,
    name: 'Season 1',
    isFirst: true,
    isLast: false,
  },
  leaderboardId: 789,
  isLoading: false,
  setPreviousSeason: jest.fn(),
  setNextSeason: jest.fn(),
};

jest.mock('../../data/useCommunityLeaderboard/useCommunityLeaderboard');
const useCommunityLeaderboardMock = jest.mocked(useCommunityLeaderboard);
const defaultCommunityLeaderboardReturnValue: ReturnType<typeof useCommunityLeaderboard> = {
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

const renderUseLeaderboardStats = (...props: Parameters<typeof useLeaderboardStats>) => {
  const { result } = renderHook(() => useLeaderboardStats(...props));

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useCommunityLeaderboardMock).toHaveBeenCalledTimes(1);
  expect(useCommunityLeaderboardMock).toHaveBeenCalledWith(789);

  return { result };
};

describe('useLeaderboardStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useCommunityLeaderboardMock.mockReturnValue(defaultCommunityLeaderboardReturnValue);
  });

  it('returns correct values when season is loading', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonReturnValue,
      isLoading: true,
    });
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: undefined,
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.isLoading).toBe(true);
  });

  it('returns correct values when leaderboard entries are loading', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: undefined,
      isLoading: true,
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.firstPlayerElo).toBeUndefined();
    expect(result.current.lastPlayerElo).toBeUndefined();
    expect(result.current.lastAethereanElo).toBeUndefined();
  });

  it('returns error state when leaderboard entries fail to load', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: undefined,
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.isError).toBe(true);
    expect(result.current.firstPlayerElo).toBeUndefined();
    expect(result.current.lastPlayerElo).toBeUndefined();
    expect(result.current.lastAethereanElo).toBeUndefined();
  });

  it('returns error state when leaderboard entries are empty', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: [],
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.isError).toBe(true);
    expect(result.current.firstPlayerElo).toBeUndefined();
    expect(result.current.lastPlayerElo).toBeUndefined();
    expect(result.current.lastAethereanElo).toBeUndefined();
  });

  it('returns correct values for complete leaderboard', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
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

    const { result } = renderUseLeaderboardStats();

    expect(result.current.firstPlayerElo).toBe(2162);
    expect(result.current.lastPlayerElo).toBe(-100);
    expect(result.current.lastAethereanElo).toBe(1837);
    expect(result.current.leaderboardEntries).toEqual(defaultCommunityLeaderboardReturnValue.leaderboardEntries);
  });

  it('returns 0 as lastPlayerElo when it is above 0', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: [
        { steamId: 1, position: 1, elo: 1000 },
        { steamId: 2, position: 2, elo: 50 },
      ],
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.lastPlayerElo).toBe(0);
  });

  it('returns 0 as lastAethereanElo when there are no aetherean players', () => {
    useCommunityLeaderboardMock.mockReturnValue({
      ...defaultCommunityLeaderboardReturnValue,
      leaderboardEntries: [
        // All players below Aetherean threshold or above position 100
        { steamId: 1, position: 101, elo: 1850 }, // Above threshold but position > 100
        { steamId: 2, position: 1, elo: 1799 }, // Below threshold
        { steamId: 3, position: 2, elo: 1000 },
        { steamId: 4, position: 3, elo: 500 },
      ],
    });

    const { result } = renderUseLeaderboardStats();

    expect(result.current.lastAethereanElo).toBe(0);
  });
});
