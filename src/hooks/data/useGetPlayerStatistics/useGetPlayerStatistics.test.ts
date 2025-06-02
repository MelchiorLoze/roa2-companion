import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';
import { StatisticName } from '@/types/stats';

import { useGetPlayerStatistics } from './useGetPlayerStatistics';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetPlayerStatistics = async () => {
  const { result } = renderHook(useGetPlayerStatistics, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetPlayerStatistics', () => {
  it('returns nothing when the request is loading', async () => {
    const { result } = renderHook(useGetPlayerStatistics, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isError).toBe(false);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('returns nothing when the request fails', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('returns statistics when the request succeeds', async () => {
    fetchMock.postOnce('*', {
      data: {
        Statistics: [
          { StatisticName: StatisticName.RANKED_S1_ELO, Value: 932 },
          { StatisticName: StatisticName.RANKED_S1_SETS, Value: 708 },
        ],
      },
    });

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toEqual({
      [StatisticName.RANKED_S1_ELO]: 932,
      [StatisticName.RANKED_S1_SETS]: 708,
    });
    expect(result.current.isError).toBe(false);
  });

  it('refetches the data', async () => {
    fetchMock.postOnce('*', {
      data: {
        Statistics: [
          { StatisticName: StatisticName.RANKED_S1_ELO, Value: 932 },
          { StatisticName: StatisticName.RANKED_S1_SETS, Value: 708 },
        ],
      },
    });

    const { result } = await renderUseGetPlayerStatistics();

    expect(result.current.statistics).toEqual({
      [StatisticName.RANKED_S1_ELO]: 932,
      [StatisticName.RANKED_S1_SETS]: 708,
    });

    fetchMock.postOnce('*', {
      data: {
        Statistics: [
          { StatisticName: StatisticName.RANKED_S1_ELO, Value: 1000 },
          { StatisticName: StatisticName.RANKED_S1_SETS, Value: 800 },
        ],
      },
    });

    await result.current.refetch();

    await waitFor(() =>
      expect(result.current.statistics).toEqual({
        [StatisticName.RANKED_S1_ELO]: 1000,
        [StatisticName.RANKED_S1_SETS]: 800,
      }),
    );
    expect(result.current.isError).toBe(false);
  });
});
