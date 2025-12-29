import { act, renderHook } from '@testing-library/react-native';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserGlobalStats } from './useUserGlobalStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);

const renderUseUserGlobalStats = () => {
  const { result } = renderHook(useUserGlobalStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserGlobalStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: true,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats.gameStats).toBeUndefined();
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: true,
      isError: false,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats.gameStats).toBeTruthy();
  });

  it('returns nothing when statistics are not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats.gameStats).toBeUndefined();
  });

  it('computes global stats correctly from player statistics', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.TOTAL_GAMES]: 200,
      [StatisticName.TOTAL_WINS]: 120,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toEqual({
      gameStats: { gameCount: 200, winCount: 120, winRate: 60 },
    });
  });

  it('handles zero matches played when calculating win rates', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.TOTAL_GAMES]: 0,
      [StatisticName.TOTAL_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.stats.gameStats?.winRate).toBe(0);
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

    const { result } = renderUseUserGlobalStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
  });
});
