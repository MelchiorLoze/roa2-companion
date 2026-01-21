import { act, renderHook } from '@testing-library/react-native';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserCrewsStats } from './useUserCrewsStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);
const defaultPlayerStatisticsReturnValue: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.CREWS_ELO]: 10950,
    [StatisticName.CREWS_SETS]: 30,
    [StatisticName.CREWS_BEST_WIN_STREAK]: 5,
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
      statisticName: StatisticName.CREWS_ELO,
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

const renderUseUserCrewsStats = () => {
  const { result } = renderHook(useUserCrewsStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserCrewsStats', () => {
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

    const { result } = renderUseUserCrewsStats();

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

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      isRefetching: true,
    });

    const { result } = renderUseUserCrewsStats();

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

    const { result } = renderUseUserCrewsStats();

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

  it('computes crews stats correctly from player statistics', () => {
    const { result } = renderUseUserCrewsStats();

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
      [StatisticName.CREWS_SETS]: 25,
      [StatisticName.CREWS_BEST_WIN_STREAK]: 3,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats!.elo).toBe(1000);
    expect(result.current.stats!.setStats?.setCount).toBe(25);
  });

  it('handles missing set count by defaulting to 0', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.CREWS_ELO]: 12000,
      [StatisticName.CREWS_BEST_WIN_STREAK]: 7,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats!.elo).toBe(2000);
    expect(result.current.stats!.setStats?.setCount).toBe(0);
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

    const { result } = renderUseUserCrewsStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchLeaderboardPosition).toHaveBeenCalledTimes(1);
  });
});
