import { renderHook } from '@testing-library/react-native';

import { useGetInventoryItems } from '@/hooks/data/useGetInventoryItems/useGetInventoryItems';
import { CurrencyId } from '@/types/currency';

import { useCurrencyBalance } from './useCurrencyBalance';

jest.mock('@/hooks/data/useGetInventoryItems/useGetInventoryItems');
const useGetInventoryItemsMock = jest.mocked(useGetInventoryItems);

const defaultInventoryItemsReturnValue: ReturnType<typeof useGetInventoryItems> = {
  inventoryItems: undefined,
  isLoading: false,
};

describe('useCurrencyBalance', () => {
  it('returns undefined balances and loading state when the inventory items are loading', () => {
    useGetInventoryItemsMock.mockReturnValue({
      ...defaultInventoryItemsReturnValue,
      isLoading: true,
    });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBeUndefined();
    expect(result.current.bucksBalance).toBeUndefined();
    expect(result.current.medalsBalance).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('returns the currency balances when the inventory items are loaded', () => {
    useGetInventoryItemsMock.mockReturnValue({
      ...defaultInventoryItemsReturnValue,
      inventoryItems: [
        { id: '1', amount: 1 },
        { id: CurrencyId.COINS, amount: 100 },
        { id: '3', amount: 3 },
        { id: CurrencyId.BUCKS, amount: 200 },
        { id: '5', amount: 5 },
        { id: CurrencyId.MEDALS, amount: 300 },
      ],
    });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(100);
    expect(result.current.bucksBalance).toBe(200);
    expect(result.current.medalsBalance).toBe(300);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns zero when the currency is not found', () => {
    useGetInventoryItemsMock.mockReturnValue({
      ...defaultInventoryItemsReturnValue,
      inventoryItems: [
        { id: '1', amount: 1 },
        { id: '3', amount: 3 },
      ],
    });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(0);
    expect(result.current.bucksBalance).toBe(0);
    expect(result.current.medalsBalance).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns undefined balances and error state when the inventory items failed to load', () => {
    useGetInventoryItemsMock.mockReturnValue(defaultInventoryItemsReturnValue);

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBeUndefined();
    expect(result.current.bucksBalance).toBeUndefined();
    expect(result.current.medalsBalance).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
