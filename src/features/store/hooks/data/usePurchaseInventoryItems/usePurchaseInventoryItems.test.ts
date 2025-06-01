import { act, renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { invalidateGetInventoryItems } from '@/hooks/data';
import { TestQueryClientProvider } from '@/test-helpers';
import { CurrencyId } from '@/types/currency';

import { invalidateGetMyRotationalCoinStore } from '../useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';
import { usePurchaseInventoryItems } from './usePurchaseInventoryItems';

jest.mock('@/contexts', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

jest.mock('@/hooks/data');
const invalidateGetInventoryItemsMock = jest.mocked(invalidateGetInventoryItems);

jest.mock('../useGetMyRotationalCoinStore/useGetMyRotationalCoinStore');
const invalidateGetMyRotationalCoinStoreMock = jest.mocked(invalidateGetMyRotationalCoinStore);

const renderUsePurchaseInventoryItems = async (...props: Parameters<typeof usePurchaseInventoryItems>) => {
  const { result } = renderHook(() => usePurchaseInventoryItems(...props), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('usePurchaseInventoryItems', () => {
  it('returns the mutation function when logged in', async () => {
    const { result } = await renderUsePurchaseInventoryItems();

    expect(result.current.purchase).toBeDefined();
    expect(result.current.isError).toBe(false);
    expect(invalidateGetInventoryItemsMock).toHaveBeenCalledTimes(0);
    expect(invalidateGetMyRotationalCoinStoreMock).toHaveBeenCalledTimes(0);
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 200,
        body: {},
      });
    });

    it('invalidates inventory and rotation cache when using coins', async () => {
      const { result } = await renderUsePurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.COINS } }),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
      expect(invalidateGetInventoryItemsMock).toHaveBeenCalledTimes(1);
      expect(invalidateGetMyRotationalCoinStoreMock).toHaveBeenCalledTimes(1);
    });

    it('invalidates inventory cache when using bucks', async () => {
      const { result } = await renderUsePurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.BUCKS } }),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isError).toBe(false);
      expect(invalidateGetInventoryItemsMock).toHaveBeenCalledTimes(1);
      expect(invalidateGetMyRotationalCoinStoreMock).toHaveBeenCalledTimes(0);
    });

    it('calls onSuccess callback if provided', async () => {
      const onSuccess = jest.fn();
      const { result } = await renderUsePurchaseInventoryItems({ onSuccess });

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.COINS } }),
      );

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.postOnce('*', {
        status: 400,
      });
    });

    it('returns an error', async () => {
      const { result } = await renderUsePurchaseInventoryItems();

      await act(async () =>
        result.current.purchase?.({ id: '1', price: { value: 100, currencyId: CurrencyId.COINS } }),
      );

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(invalidateGetInventoryItemsMock).toHaveBeenCalledTimes(0);
      expect(invalidateGetMyRotationalCoinStoreMock).toHaveBeenCalledTimes(0);
    });
  });
});
