import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers';
import { Character } from '@/types/character';

import { useGetUserReadOnlyData } from './useGetUserReadOnlyData';

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetUserReadOnlyData = async () => {
  const { result } = renderHook(useGetUserReadOnlyData, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetUserReadOnlyData', () => {
  it('should return nothing when the request is loading', async () => {
    const { result } = renderHook(useGetUserReadOnlyData, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.userData).toBeUndefined();
    expect(result.current.isError).toBe(false);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should return nothing when the request fails', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetUserReadOnlyData();

    expect(result.current.userData).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('should return statistics when the request succeeds', async () => {
    fetchMock.postOnce('*', {
      data: {
        Data: {
          character_data: { Value: '{"Cla":{"lvl":40}, "Ran":{"lvl":213}}' },
        },
      },
    });

    const { result } = await renderUseGetUserReadOnlyData();

    expect(result.current.userData).toEqual({
      characterData: {
        [Character.CLAIREN]: { lvl: 40 },
        [Character.RANNO]: { lvl: 213 },
      },
    });
    expect(result.current.isError).toBe(false);
  });

  it('should refetch the data', async () => {
    fetchMock.postOnce('*', {
      data: {
        Data: {
          character_data: { Value: '{"Cla":{"lvl":40}, "Ran":{"lvl":213}}' },
        },
      },
    });

    const { result } = await renderUseGetUserReadOnlyData();

    expect(result.current.userData).toEqual({
      characterData: {
        [Character.CLAIREN]: { lvl: 40 },
        [Character.RANNO]: { lvl: 213 },
      },
    });

    fetchMock.postOnce('*', {
      data: {
        Data: {
          character_data: { Value: '{"Cla":{"lvl":42}, "Ran":{"lvl":227}, "Kra":{"lvl":40}}' },
        },
      },
    });

    result.current.refetch();

    await waitFor(() =>
      expect(result.current.userData).toEqual({
        characterData: {
          [Character.CLAIREN]: { lvl: 42 },
          [Character.RANNO]: { lvl: 227 },
          [Character.KRAGG]: { lvl: 40 },
        },
      }),
    );
    expect(result.current.isError).toBe(false);
  });
});
