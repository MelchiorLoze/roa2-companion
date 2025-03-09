import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useSession } from '@/contexts/AuthContext/AuthContext';
import { createItemDto, TestQueryClientProvider } from '@/test-helpers';
import { Item, Rarity } from '@/types/store';

import { useSearchItems } from './useSearchItems';

jest.mock('@/contexts/AuthContext/AuthContext');
const useSessionMock = jest.mocked(useSession);

const renderUseSearchItems = async (itemIds: Item['id'][]) => {
  const { result } = renderHook(() => useSearchItems(itemIds), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useSearchItems', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({ entityToken: 'entityToken', isLoggedIn: true } as ReturnType<typeof useSession>);
  });

  describe('should return empty array', () => {
    it('when not logged in', async () => {
      useSessionMock.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useSession>);
      const { result } = await renderUseSearchItems(['1', '2']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(false);
    });

    it('when itemIds is empty', async () => {
      const { result } = await renderUseSearchItems([]);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request succeeds', () => {
    it('should return items with one batch', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('1', 'skin', 500), createItemDto('2', 'icon', 20)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2']);

      expect(result.current.items).toEqual([
        { id: '1', title: 'Item 1', category: 'skin', rarity: Rarity.COMMON, buckPrice: 500, coinPrice: 50000 },
        { id: '2', title: 'Item 2', category: 'icon', rarity: Rarity.COMMON, buckPrice: 20, coinPrice: 2000 },
      ]);
      expect(result.current.isError).toBe(false);
    });

    it('should return items with multiple batches', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('1', 'skin', 500)],
        },
      });
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('2', 'icon', 20)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

      expect(result.current.items).toEqual([
        { id: '1', title: 'Item 1', category: 'skin', rarity: Rarity.COMMON, buckPrice: 500, coinPrice: 50000 },
        { id: '2', title: 'Item 2', category: 'icon', rarity: Rarity.COMMON, buckPrice: 20, coinPrice: 2000 },
      ]);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.post('*', { status: 400 });
    });

    it('should return nothing with one batch', async () => {
      const { result } = await renderUseSearchItems(['1', '2']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(true);
    });

    it('should return nothing with multiple batches', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('1', 'skin', 500)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(true);
    });
  });
});
