import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { TestQueryClientProvider } from '@/test-helpers';
import { CurrencyId } from '@/types/store';

import { usePurchaseInventoryItems } from './usePurchaseInventoryItems';

jest.mock('@/contexts/AuthContext/AuthContext');
const useAuthMock = jest.mocked(useAuth);

const invalidateGetInventoryItemsSpy = jest.spyOn(
  require('../useGetInventoryItems/useGetInventoryItems'),
  'invalidateGetInventoryItems',
);
const invalidateGetMyRotationalCoinStoreSpy = jest.spyOn(
  require('../useMyRotationalCoinStore/useGetMyRotationalCoinStore'),
  'invalidateGetMyRotationalCoinStore',
);

const renderPurchaseInventoryItems = async () => {
  const { result } = renderHook(usePurchaseInventoryItems, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('usePurchaseInventoryItems', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue({ isLoggedIn: true, entityToken: 'token' } as ReturnType<typeof useAuth>);
  });

  afterEach(() => {
    invalidateGetInventoryItemsSpy.mockClear();
    invalidateGetMyRotationalCoinStoreSpy.mockClear();
  });

  it('should not return the mutation function when not logged in', async () => {
    useAuthMock.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useAuth>);

    const { result } = await renderPurchaseInventoryItems();

    expect(result.current.purchase).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(invalidateGetInventoryItemsSpy).toHaveBeenCalledTimes(0);
    expect(invalidateGetMyRotationalCoinStoreSpy).toHaveBeenCalledTimes(0);
  });

  it('should return the mutation function when logged in', async () => {
    const { result } = await renderPurchaseInventoryItems();

    expect(result.current.purchase).toBeDefined();
    expect(result.current.isError).toBe(false);
    expect(invalidateGetInventoryItemsSpy).toHaveBeenCalledTimes(0);
    expect(invalidateGetMyRotationalCoinStoreSpy).toHaveBeenCalledTimes(0);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 200,
        body: {},
      });
    });

    it('should invalidate inventory and rotation cache when using coins', async () => {
      const { result } = await renderPurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.COINS } }),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
      expect(invalidateGetInventoryItemsSpy).toHaveBeenCalledTimes(1);
      expect(invalidateGetMyRotationalCoinStoreSpy).toHaveBeenCalledTimes(1);
    });

    it('should invalidate inventory cache when using bucks', async () => {
      const { result } = await renderPurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.BUCKS } }),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
      expect(invalidateGetInventoryItemsSpy).toHaveBeenCalledTimes(1);
      expect(invalidateGetMyRotationalCoinStoreSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.post('*', {
        status: 400,
      });
    });

    it('should return an error', async () => {
      const { result } = await renderPurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.COINS } }),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(true);
      expect(invalidateGetInventoryItemsSpy).toHaveBeenCalledTimes(0);
      expect(invalidateGetMyRotationalCoinStoreSpy).toHaveBeenCalledTimes(0);
    });
  });
});
