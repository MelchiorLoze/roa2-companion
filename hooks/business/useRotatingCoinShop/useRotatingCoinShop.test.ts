import { renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useGetItems, useGetMyRotationalCoinStore } from '@/hooks/data';
import { Item, Rarity } from '@/types/store';

import { useRotatingCoinShop } from './useRotatingCoinShop';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('@/hooks/data');
const useGetMyRotationalCoinStoreMock = jest.mocked(useGetMyRotationalCoinStore);
const useGetItemsMock = jest.mocked(useGetItems);

describe('useRotatingCoinShop', () => {
  beforeEach(() => {
    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: undefined,
      isLoading: false,
      isError: false,
    });

    useGetItemsMock.mockReturnValue({
      items: [],
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle null rotationalCoinStore', () => {
    const { result } = renderHook(useRotatingCoinShop);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(result.current.expirationDate).toBeUndefined();
  });

  it('should return loading state when rotational coin store is loading', () => {
    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: undefined,
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useRotatingCoinShop);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.expirationDate).toBeUndefined();
  });

  it('should return loading state when items are loading', () => {
    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: { itemIds: ['1', '2', '3'], expirationDate: VALID_DATE },
      isLoading: false,
      isError: false,
    });
    useGetItemsMock.mockReturnValue({
      items: [],
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useRotatingCoinShop);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.expirationDate).toEqual(VALID_DATE);
  });

  it('should pass correct itemIds to useGetItems', () => {
    const itemIds = ['1', '2', '3'];

    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: { itemIds, expirationDate: DateTime.utc().plus({ days: 1 }) },
      isLoading: false,
      isError: false,
    });

    renderHook(useRotatingCoinShop);

    expect(useGetItems).toHaveBeenCalledWith(itemIds);
  });

  it('should return sorted items when data is loaded', () => {
    const mockItems: Item[] = [
      { id: '1', title: 'Item B', coinPrice: 20, category: 'icon', rarity: Rarity.LEGENDARY },
      { id: '2', title: 'Item A', coinPrice: 10, category: 'icon', rarity: Rarity.COMMON },
      { id: '3', title: 'Item C', coinPrice: 10, category: 'deatheffect', rarity: Rarity.EPIC },
      { id: '4', title: 'Item D', coinPrice: undefined, category: 'deatheffect', rarity: Rarity.RARE },
    ];

    const expectedSortedItems: Item[] = [
      { id: '4', title: 'Item D', coinPrice: undefined, category: 'deatheffect', rarity: Rarity.RARE },
      { id: '3', title: 'Item C', coinPrice: 10, category: 'deatheffect', rarity: Rarity.EPIC },
      { id: '2', title: 'Item A', coinPrice: 10, category: 'icon', rarity: Rarity.COMMON },
      { id: '1', title: 'Item B', coinPrice: 20, category: 'icon', rarity: Rarity.LEGENDARY },
    ];

    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: { itemIds: ['1', '2', '3', '4'], expirationDate: VALID_DATE },
      isLoading: false,
      isError: false,
    });
    useGetItemsMock.mockReturnValue({
      items: mockItems,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useRotatingCoinShop);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual(expectedSortedItems);
    expect(result.current.expirationDate).toEqual(VALID_DATE);
  });
});
