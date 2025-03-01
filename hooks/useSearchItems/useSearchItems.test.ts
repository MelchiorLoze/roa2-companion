import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { TestQueryClientProvider } from '@/test-helpers';
import { Category, CurrencyId } from '@/types/store';
import { useSearchItems } from './useSearchItems';

jest.mock('@/contexts/AuthContext/AuthContext');
const mockUseAuth = jest.mocked(useAuth);

const createItem = (id: string, category: Category, buckPrice: number) => ({
  Id: id,
  Title: { NEUTRAL: `Item ${id}` },
  ContentType: category,
  PriceOptions: {
    Prices: [
      {
        Amounts: [{ ItemId: CurrencyId.BUCKS, Amount: buckPrice }],
      },
      {
        Amounts: [{ ItemId: CurrencyId.COINS, Amount: buckPrice * 100 }],
      },
    ],
  },
});

const renderUseSearchItems = async (itemIds: string[]) => {
  const { result } = renderHook(() => useSearchItems(itemIds), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useSearchItems', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ entityToken: 'entityToken', isLoggedIn: true } as ReturnType<typeof useAuth>);
  });

  describe('should return empty array', () => {
    it('when not logged in', async () => {
      mockUseAuth.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useAuth>);
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
          Items: [createItem('1', 'skin', 500), createItem('2', 'icon', 20)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2']);

      expect(result.current.items).toEqual([
        { id: '1', title: 'Item 1', category: 'skin', buckPrice: 500, coinPrice: 50000 },
        { id: '2', title: 'Item 2', category: 'icon', buckPrice: 20, coinPrice: 2000 },
      ]);
      expect(result.current.isError).toBe(false);
    });

    it('should return items with multiple batches', async () => {
      fetchMock.postOnce('*', {
        data: {
          Items: [createItem('1', 'skin', 500)],
        },
      });
      fetchMock.postOnce('*', {
        data: {
          Items: [createItem('2', 'icon', 20)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

      expect(result.current.items).toEqual([
        { id: '1', title: 'Item 1', category: 'skin', buckPrice: 500, coinPrice: 50000 },
        { id: '2', title: 'Item 2', category: 'icon', buckPrice: 20, coinPrice: 2000 },
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
          Items: [createItem('1', 'skin', 500)],
        },
      });

      const { result } = await renderUseSearchItems(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

      expect(result.current.items).toEqual([]);
      expect(result.current.isError).toBe(true);
    });
  });
});
