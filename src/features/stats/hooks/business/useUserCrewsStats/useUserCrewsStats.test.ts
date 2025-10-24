import { act, renderHook } from '@testing-library/react-native';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserCrewsStats } from './useUserCrewsStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);

const renderUseUserCrewsStats = () => {
  const { result } = renderHook(useUserCrewsStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserCrewsStats', () => {
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

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toBeUndefined();
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
    expect(result.current.stats).toBeDefined();
  });

  it('returns nothing when statistics are not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('computes crews stats correctly from player statistics', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.CREWS_ELO]: 11500,
      [StatisticName.CREWS_SETS]: 50,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserCrewsStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 1500,
      setStats: { setCount: 50 },
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

    expect(result.current.stats?.elo).toBe(1000);
    expect(result.current.stats?.setStats.setCount).toBe(25);
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

    expect(result.current.stats?.elo).toBe(2000);
    expect(result.current.stats?.setStats.setCount).toBe(0);
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

    const { result } = renderUseUserCrewsStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
  });
});
