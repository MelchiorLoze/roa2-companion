import { act, renderHook } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';
import { useUserGlobalStats } from './useUserGlobalStats';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);

jest.mock('../../data/useGetUserReadOnlyData/useGetUserReadOnlyData');
const useGetUserReadOnlyDataMock = jest.mocked(useGetUserReadOnlyData);

const defaultPlayerStatisticsReturnValue: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.TOTAL_GAMES]: 100,
    [StatisticName.TOTAL_WINS]: 60,
    [StatisticName.KRA_MATCH_COUNT]: 30,
    [StatisticName.CLA_MATCH_COUNT]: 20,
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
};

const defaultUserReadOnlyDataReturnValue: ReturnType<typeof useGetUserReadOnlyData> = {
  userData: {
    characterData: {
      [Character.KRAGG]: { lvl: 5 },
      [Character.CLAIREN]: { lvl: 3 },
      [Character.FLEET]: { lvl: 0 },
      [Character.FORSBURN]: { lvl: 0 },
      [Character.LOXODONT]: { lvl: 0 },
      [Character.MAYPUL]: { lvl: 0 },
      [Character.ORCANE]: { lvl: 0 },
      [Character.RANNO]: { lvl: 0 },
      [Character.WRASTOR]: { lvl: 0 },
      [Character.ZETTERBURN]: { lvl: 0 },
      [Character.OLYMPIA]: { lvl: 0 },
      [Character.ABSA]: { lvl: 0 },
      [Character.ETALUS]: { lvl: 0 },
      [Character.LAREINA]: { lvl: 0 },
      [Character.GALVAN]: { lvl: 0 },
      [Character.RANDOM]: undefined,
    },
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
};

const renderUseUserGlobalStats = () => {
  const { result } = renderHook(useUserGlobalStats);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);
  expect(useGetUserReadOnlyDataMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserGlobalStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue(defaultPlayerStatisticsReturnValue);
    useGetUserReadOnlyDataMock.mockReturnValue(defaultUserReadOnlyDataReturnValue);
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: undefined,
      isLoading: true,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      isRefetching: true,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.gameStats).toBeTruthy();
  });

  it('computes global stats correctly from player statistics', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.TOTAL_GAMES]: 200,
      [StatisticName.TOTAL_WINS]: 120,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toMatchObject({
      gameStats: { gameCount: 200, winCount: 120, winRate: 60 },
    });
    expect(result.current.stats?.characterStats).toHaveLength(16);
  });

  it('handles zero matches played when calculating win rates', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.TOTAL_GAMES]: 0,
      [StatisticName.TOTAL_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: mockStatistics,
    });

    const { result } = renderUseUserGlobalStats();

    expect(result.current.stats?.gameStats?.winRate).toBe(0);
  });

  it('passes through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();

    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      refetch: mockRefetchStatistics,
    });

    const { result } = renderUseUserGlobalStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
  });
});
