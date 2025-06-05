import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useGetInventoryItems } from './useGetInventoryItems';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const renderUseGetInventoryItems = async () => {
  const { result } = renderHook(useGetInventoryItems, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetInventoryItems', () => {
  it('returns empty array when the request is loading', async () => {
    const { result } = renderHook(useGetInventoryItems, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.inventoryItems).toEqual([]);
    expect(result.current.isError).toBe(false);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 200,
        body: {
          data: {
            Items: [
              { Id: '1', Amount: 1 },
              { Id: '2', Amount: 2 },
            ],
          },
        },
      });
    });

    it('returns the rotational coin store', async () => {
      const { result } = await renderUseGetInventoryItems();

      expect(result.current.inventoryItems).toEqual([
        { id: '1', amount: 1 },
        { id: '2', amount: 2 },
      ]);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 400,
      });
    });

    it('returns an empty array', async () => {
      const { result } = await renderUseGetInventoryItems();

      expect(result.current.inventoryItems).toEqual([]);
      expect(result.current.isError).toBe(true);
    });
  });
});
