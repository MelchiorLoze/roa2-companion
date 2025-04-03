import { renderHook } from '@testing-library/react-native';

import { useGetInventoryItems } from '@/hooks/data';
import { CurrencyId } from '@/types/store';

import { useCurrencyBalance } from './useCurrencyBalance';

jest.mock('@/hooks/data/useGetInventoryItems/useGetInventoryItems');
const useGetInventoryItemsMock = jest.mocked(useGetInventoryItems);

describe('useCurrencyBalance', () => {
  it('should return zero when the inventory items are not loaded', () => {
    useGetInventoryItemsMock.mockReturnValue({ inventoryItems: [], isLoading: true, isError: false });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(0);
    expect(result.current.bucksBalance).toBe(0);
    expect(result.current.medalsBalance).toBe(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should return the currency balances when the inventory items are loaded', () => {
    useGetInventoryItemsMock.mockReturnValue({
      inventoryItems: [
        { id: '1', amount: 1 },
        { id: CurrencyId.COINS, amount: 100 },
        { id: '3', amount: 3 },
        { id: CurrencyId.BUCKS, amount: 200 },
        { id: '5', amount: 5 },
        { id: CurrencyId.MEDALS, amount: 300 },
      ],
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(100);
    expect(result.current.bucksBalance).toBe(200);
    expect(result.current.medalsBalance).toBe(300);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return zero when the currency is not found', () => {
    useGetInventoryItemsMock.mockReturnValue({
      inventoryItems: [
        { id: '1', amount: 1 },
        { id: '3', amount: 3 },
      ],
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(0);
    expect(result.current.bucksBalance).toBe(0);
    expect(result.current.medalsBalance).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return zero when the inventory items failed to load', () => {
    useGetInventoryItemsMock.mockReturnValue({ inventoryItems: [], isLoading: false, isError: true });

    const { result } = renderHook(useCurrencyBalance);

    expect(result.current.coinsBalance).toBe(0);
    expect(result.current.bucksBalance).toBe(0);
    expect(result.current.medalsBalance).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
