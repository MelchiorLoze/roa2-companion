import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers';
import { StatisticName } from '@/types/stats';

import { useGetPlayerStatistics } from './useGetPlayerStatistics';

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetPlayerStatistics = async () => {
  const { result } = renderHook(useGetPlayerStatistics, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetPlayerStatistics', () => {
  it('should return empty array when the request is loading', async () => {
    const { result } = renderHook(useGetPlayerStatistics, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should return empty array when the request fails', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('should return statistics when the request succeeds', async () => {
    fetchMock.postOnce('*', {
      data: {
        Statistics: [
          { StatisticName: StatisticName.RANKED_SEASON_ELO, Value: 932 },
          { StatisticName: StatisticName.RANKED_SEASON_MATCHES, Value: 708 },
        ],
      },
    });

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toEqual({
      [StatisticName.RANKED_SEASON_ELO]: 932,
      [StatisticName.RANKED_SEASON_MATCHES]: 708,
    });
    expect(result.current.isError).toBe(false);
  });
});
