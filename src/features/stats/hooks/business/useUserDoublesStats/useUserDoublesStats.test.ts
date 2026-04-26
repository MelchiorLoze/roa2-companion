import { act, renderHook } from '@testing-library/react-native';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserDoublesStats } from './useUserDoublesStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);
const defaultPlayerStatisticsReturnValue: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.RANKED_SEASON_INDEX]: 4,
    [StatisticName.DOUBLES_ELO]: 20950,
    [StatisticName.DOUBLES_SETS]: 30,
    [StatisticName.DOUBLES_BEST_WIN_STREAK]: 5,
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
};

jest.mock('../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer');
const useGetLeaderboardAroundPlayerMock = jest.mocked(useGetLeaderboardAroundPlayer);
const defaultLeaderboardAroundPlayerReturnValue: ReturnType<typeof useGetLeaderboardAroundPlayer> = {
  playerPositions: [
    {
      statisticName: StatisticName.DOUBLES_ELO,
      statisticValue: 916,
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    },
  ],
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
};

const renderUseUserDoublesStats = () => {
  const { result } = renderHook(useUserDoublesStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserDoublesStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue(defaultPlayerStatisticsReturnValue);
    useGetLeaderboardAroundPlayerMock.mockReturnValue(defaultLeaderboardAroundPlayerReturnValue);
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: undefined,
      isLoading: true,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('returns loading state when leaderboard position is loading', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerReturnValue,
      playerPositions: undefined,
      isLoading: true,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      isRefetching: true,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
      bestWinStreak: 5,
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    });
  });

  it('returns refetching state when leaderboard position is being refetched', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerReturnValue,
      isRefetching: true,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
      bestWinStreak: 5,
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    });
  });

  it('computes doubles stats correctly from player statistics', () => {
    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
      bestWinStreak: 5,
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    });
  });

  it('handles missing elo stat by defaulting to 1000', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.RANKED_SEASON_INDEX]: 1,
      [StatisticName.DOUBLES_SETS]: 25,
      [StatisticName.DOUBLES_BEST_WIN_STREAK]: 3,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.elo).toBe(1000);
    expect(result.current.stats?.setStats.setCount).toBe(25);
  });

  it('handles missing set count by defaulting to 0', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.RANKED_SEASON_INDEX]: 1,
      [StatisticName.DOUBLES_ELO]: 22000,
      [StatisticName.DOUBLES_BEST_WIN_STREAK]: 7,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.elo).toBe(2000);
    expect(result.current.stats?.setStats.setCount).toBe(0);
  });

  it('handles missing best win streak by defaulting to 0', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.RANKED_SEASON_INDEX]: 1,
      [StatisticName.DOUBLES_ELO]: 21500,
      [StatisticName.DOUBLES_SETS]: 15,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.elo).toBe(1500);
    expect(result.current.stats?.setStats.setCount).toBe(15);
    expect(result.current.stats?.bestWinStreak).toBe(0);
  });

  it('passes through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      refetch: mockRefetchStatistics,
    });

    const mockRefetchLeaderboardPosition = jest.fn();
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerReturnValue,
      refetch: mockRefetchLeaderboardPosition,
    });

    const { result } = renderUseUserDoublesStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchLeaderboardPosition).toHaveBeenCalledTimes(1);
  });

  it('returns error state when both hooks fail', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: undefined,
    });

    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerReturnValue,
      playerPositions: undefined,
    });

    const { result } = renderUseUserDoublesStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.stats).toBeUndefined();
  });
});
