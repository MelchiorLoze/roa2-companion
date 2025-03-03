import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { createItemDto, TestQueryClientProvider } from '@/test-helpers';
import { Item } from '@/types/store';

import { useGetItems } from './useGetItems';

jest.mock('@/contexts/AuthContext/AuthContext');
const useAuthMock = jest.mocked(useAuth);

const renderUseGetItems = async (itemIds: Item['id'][]) => {
  const { result } = renderHook(() => useGetItems(itemIds), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetItems', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ entityToken: 'entityToken', isLoggedIn: true } as ReturnType<typeof useAuth>);
  });

  describe('should return empty array', () => {
    it('when not logged in', async () => {
      useAuthMock.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useAuth>);
      const { result } = await renderUseGetItems(['1', '2']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(false);
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
    it('should return items', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItemDto('1', 'skin', 500), createItemDto('2', 'icon', 20)],
        },
      });

      const { result } = await renderUseGetItems(['1', '2']);

      expect(result.current.items).toEqual([
        { id: '1', title: 'Item 1', category: 'skin', buckPrice: 500, coinPrice: 50000 },
        { id: '2', title: 'Item 2', category: 'icon', buckPrice: 20, coinPrice: 2000 },
      ]);
      expect(result.current.isError).toBe(false);
    });
  });
});
