import { renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useGetItems } from '@/hooks/data/useGetItems/useGetItems';
import { Category, type Item, Rarity } from '@/types/item';

import { useGetMyRotationalCoinStore } from '../../data/useGetMyRotationalCoinStore/useGetMyRotationalCoinStore';
import { useRotatingCoinShop } from './useRotatingCoinShop';

const VALID_DATE = DateTime.utc().plus({ day: 1 });

jest.mock('../../data/useGetMyRotationalCoinStore/useGetMyRotationalCoinStore');
const useGetMyRotationalCoinStoreMock = jest.mocked(useGetMyRotationalCoinStore);

jest.mock('@/hooks/data/useGetItems/useGetItems');
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

  it('handles null rotationalCoinStore', () => {
    const { result } = renderHook(useRotatingCoinShop);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(result.current.expirationDate).toBeUndefined();
  });

  it('returns loading state when rotational coin store is loading', () => {
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

  it('returns loading state when items are loading', () => {
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

  it('passes correct itemIds to useGetItems', () => {
    const itemIds = ['1', '2', '3'];

    useGetMyRotationalCoinStoreMock.mockReturnValue({
      rotationalCoinStore: { itemIds, expirationDate: DateTime.utc().plus({ days: 1 }) },
      isLoading: false,
      isError: false,
    });

    renderHook(useRotatingCoinShop);

    expect(useGetItems).toHaveBeenCalledWith(itemIds);
  });

  it('returns sorted items when data is loaded', () => {
    const mockItems: Item[] = [
      {
        id: '1',
        imageUrl: new URL('https://www.example.com/items/Icon_item_b.png'),
        name: 'Item B',
        coinPrice: 20,
        category: Category.ICON,
        rarity: Rarity.LEGENDARY,
      },
      {
        id: '2',
        imageUrl: new URL('https://www.example.com/items/Icon_item_a.png'),
        name: 'Item A',
        coinPrice: 10,
        category: Category.ICON,
        rarity: Rarity.COMMON,
      },
      {
        id: '3',
        imageUrl: new URL('https://www.example.com/items/DeathEffect_item_c.png'),
        name: 'Item C',
        coinPrice: 10,
        category: Category.DEATHEFFECT,
        rarity: Rarity.EPIC,
      },
      {
        id: '4',
        imageUrl: new URL('https://www.example.com/items/DeathEffect_item_d.png'),
        name: 'Item D',
        coinPrice: undefined,
        category: Category.DEATHEFFECT,
        rarity: Rarity.RARE,
      },
    ];

    const expectedSortedItems: Item[] = [
      {
        id: '4',
        imageUrl: new URL('https://www.example.com/items/DeathEffect_item_d.png'),
        name: 'Item D',
        coinPrice: undefined,
        category: Category.DEATHEFFECT,
        rarity: Rarity.RARE,
      },
      {
        id: '3',
        imageUrl: new URL('https://www.example.com/items/DeathEffect_item_c.png'),
        name: 'Item C',
        coinPrice: 10,
        category: Category.DEATHEFFECT,
        rarity: Rarity.EPIC,
      },
      {
        id: '2',
        imageUrl: new URL('https://www.example.com/items/Icon_item_a.png'),
        name: 'Item A',
        coinPrice: 10,
        category: Category.ICON,
        rarity: Rarity.COMMON,
      },
      {
        id: '1',
        imageUrl: new URL('https://www.example.com/items/Icon_item_b.png'),
        name: 'Item B',
        coinPrice: 20,
        category: Category.ICON,
        rarity: Rarity.LEGENDARY,
      },
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
