import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useSession } from '@/contexts/AuthContext/AuthContext';
import { TestQueryClientProvider } from '@/test-helpers';

import { useGetInventoryItems } from './useGetInventoryItems';

jest.mock('@/contexts/AuthContext/AuthContext');
const useSessionMock = jest.mocked(useSession);

const renderUseGetInventoryItems = async () => {
  const { result } = renderHook(useGetInventoryItems, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetInventoryItems', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({ entityToken: 'token', isLoggedIn: true } as ReturnType<typeof useSession>);
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      useSessionMock.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useSession>);
    });

    it('should not perform the query', async () => {
      const { result } = await renderUseGetInventoryItems();

      expect(result.current.inventoryItems).toBeUndefined();
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
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

    it('should return the rotational coin store', async () => {
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
      fetchMock.post('*', {
        status: 400,
      });
    });

    it('should return nothing', async () => {
      const { result } = await renderUseGetInventoryItems();

      expect(result.current.inventoryItems).toBeUndefined();
      expect(result.current.isError).toBe(true);
    });
  });
});
