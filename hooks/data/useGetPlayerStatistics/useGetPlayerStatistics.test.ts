import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers';

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
    expect(result.current.statistics).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('should return empty array when the request fails', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toEqual([]);
    expect(result.current.isError).toBe(true);
  });

  it('should return statistics when the request succeeds', async () => {
    fetchMock.postOnce('*', {
      data: {
        Statistics: [
          { StatisticName: 'Statistic 1', Value: 500 },
          { StatisticName: 'Statistic 2', Value: 20 },
        ],
      },
    });

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toEqual([
      { name: 'Statistic 1', value: 500 },
      { name: 'Statistic 2', value: 20 },
    ]);
    expect(result.current.isError).toBe(false);
  });
});
