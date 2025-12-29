import { act, renderHook } from '@testing-library/react-native';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserCrewsStats } from './useUserCrewsStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);
const defaultPlayerStatisticsValue: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.CREWS_ELO]: 10950,
    [StatisticName.CREWS_SETS]: 30,
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
  isError: false,
};

jest.mock('../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer');
const useGetLeaderboardAroundPlayerMock = jest.mocked(useGetLeaderboardAroundPlayer);
const defaultLeaderboardAroundPlayerValue: ReturnType<typeof useGetLeaderboardAroundPlayer> = {
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
  isError: false,
};

const renderUseUserCrewsStats = () => {
  const { result } = renderHook(useUserCrewsStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserCrewsStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue(defaultPlayerStatisticsValue);
    useGetLeaderboardAroundPlayerMock.mockReturnValue(defaultLeaderboardAroundPlayerValue);
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: true,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toEqual({
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    });
  });

  it('returns loading state when leaderboard position is loading', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: true,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
    });
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: true,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats).toEqual({
      elo: 1000,
      setStats: { setCount: 0 },
      position: 4404,
      profile: {
        playerName: 'Player1',
        avatarUrl: new URL('https://www.example.com/icon/player1.png'),
      },
    });
  });

  it('returns refetching state when leaderboard position is being refetched', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: true,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
    });
  });

  it('computes crews stats correctly from player statistics', () => {
    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 950,
      setStats: { setCount: 30 },
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
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.stats.elo).toBe(1000);
    expect(result.current.stats.setStats?.setCount).toBe(25);
  });

  it('handles missing set count by defaulting to 0', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.CREWS_ELO]: 12000,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.stats.elo).toBe(2000);
    expect(result.current.stats.setStats?.setCount).toBe(0);
  });

  it('passes through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: mockRefetchStatistics,
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const mockRefetchLeaderboardPosition = jest.fn();
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: mockRefetchLeaderboardPosition,
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchLeaderboardPosition).toHaveBeenCalledTimes(1);
  });
});
