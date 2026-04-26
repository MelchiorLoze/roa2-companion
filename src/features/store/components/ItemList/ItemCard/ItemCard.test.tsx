import { fireEvent, render, screen } from '@testing-library/react-native';

import { Category, CATEGORY_LABELS, type Item, Rarity } from '@/types/item';

import { ItemCard } from './ItemCard';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
jest.requireMock('@shopify/react-native-skia').useCanvasSize = () => ({
  ref: null,
  size: { width: 0, height: 0 },
});

const mockItem: Item = {
  id: '1',
  imageUrl: new URL('https://www.example.com/deatheffect/deatheffect_item_1.png'),
  name: 'Item Title',
  rarity: Rarity.COMMON,
  category: Category.DEATHEFFECT,
  coinPrice: 20,
  buckPrice: 2000,
};

const onPressMock = jest.fn();

const renderComponent = (item: Item) => {
  render(<ItemCard item={item} onPress={onPressMock} />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('ItemCard', () => {
  it('renders correctly', () => {
    renderComponent(mockItem);

    expect(screen.getByText(mockItem.name)).toBeTruthy();
    expect(screen.getByText(CATEGORY_LABELS[mockItem.category].toUpperCase())).toBeTruthy();
    expect(screen.getByText(mockItem.coinPrice!.toString())).toBeTruthy();
    expect(screen.queryByText(mockItem.buckPrice!.toString())).toBeNull();
  });

  it('renders correctly when coinPrice is not defined', () => {
    renderComponent({ ...mockItem, coinPrice: undefined });

    expect(screen.getByText(mockItem.name)).toBeTruthy();
    expect(screen.getByText(CATEGORY_LABELS[mockItem.category].toUpperCase())).toBeTruthy();
    expect(screen.queryByText(mockItem.buckPrice!.toString())).toBeNull();
  });

  it('calls onPress when pressed', () => {
    renderComponent(mockItem);

    const card = screen.getByRole('button');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalled();
  });
});
