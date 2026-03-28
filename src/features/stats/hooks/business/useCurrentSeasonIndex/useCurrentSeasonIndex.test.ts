import { renderHook } from '@testing-library/react-native';

import { StatisticName } from '../../../types/stats';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useCurrentSeasonIndex } from './useCurrentSeasonIndex';

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);

const defaultPlayerStatisticsReturnValue: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.RANKED_SEASON_INDEX]: 3,
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
};

const renderUseCurrentSeasonIndex = () => {
  const { result } = renderHook(useCurrentSeasonIndex);

  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useCurrentSeasonIndex', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue(defaultPlayerStatisticsReturnValue);
  });

  it('returns the current season index from statistics', () => {
    const { result } = renderUseCurrentSeasonIndex();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.currentSeasonIndex).toBe(3);
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: undefined,
      isLoading: true,
    });

    const { result } = renderUseCurrentSeasonIndex();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.currentSeasonIndex).toBeUndefined();
  });

  it('returns error state when statistics are not loading and not available', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsReturnValue,
      statistics: undefined,
      isLoading: false,
    });

    const { result } = renderUseCurrentSeasonIndex();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.currentSeasonIndex).toBeUndefined();
  });
});
