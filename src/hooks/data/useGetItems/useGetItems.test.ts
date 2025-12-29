import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';
import { createItemDto } from '@/test-helpers/createItemDto';
import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';
import { Category, type Item, Rarity } from '@/types/item';

import { useGetItems } from './useGetItems';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);

const renderUseGetItems = async (itemIds: Item['id'][]) => {
  const { result } = renderHook(() => useGetItems(itemIds), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetItems', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  describe('returns empty array', () => {
    it('when the request is loading', async () => {
      const { result } = renderHook(() => useGetItems(['1', '2']), { wrapper: TestQueryClientProvider });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(false);
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('when itemIds is empty', async () => {
      const { result } = await renderUseGetItems([]);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(false);
    });

    it('when the request fails', async () => {
      fetchMock.postOnce('*', 400);

      const { result } = await renderUseGetItems(['1', '2']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(true);
    });
  });

  describe('when the request succeeds', () => {
    it('returns items', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('1', Category.SKIN, 500), createItemDto('2', Category.ICON, 20)],
        },
      });

      const { result } = await renderUseGetItems(['1', '2']);

      expect(result.current.items).toEqual([
        {
          id: '1',
          imageUrl: new URL('https://www.example.com/icon/icon_item_1.png'),
          name: 'Item 1',
          category: Category.SKIN,
          rarity: Rarity.COMMON,
          buckPrice: 500,
          coinPrice: 50000,
        },
        {
          id: '2',
          imageUrl: new URL('https://www.example.com/icon/icon_item_2.png'),
          name: 'Item 2',
          category: Category.ICON,
          rarity: Rarity.COMMON,
          buckPrice: 20,
          coinPrice: 2000,
        },
      ]);
      expect(result.current.isError).toBe(false);
    });
  });
});
