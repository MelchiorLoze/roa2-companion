import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { Category, CATEGORY_LABELS, type Item, Rarity } from '@/types/item';

import { ItemCard } from './ItemCard';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
jest.requireMock('@shopify/react-native-skia').useCanvasSize = () => ({
  ref: null,
  size: { width: 0, height: 0 },
});

jest.mock('@/components/OutlinedText/OutlinedText');
jest.mocked(OutlinedText).mockImplementation(({ text }) => <Text>{text}</Text>);

const item: Item = {
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
  beforeEach(() => {
    expect(item.coinPrice).toBeTruthy();
    expect(item.buckPrice).toBeTruthy();
  });

  it('renders correctly', () => {
    renderComponent(item);

    expect(screen.getByText(item.name)).toBeTruthy();
    expect(screen.getByText(CATEGORY_LABELS[item.category].toUpperCase())).toBeTruthy();
    expect(screen.getByText(item.coinPrice!.toString())).toBeTruthy();
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('renders correctly when coinPrice is not defined', () => {
    renderComponent({ ...item, coinPrice: undefined });

    expect(screen.getByText(item.name)).toBeTruthy();
    expect(screen.getByText(CATEGORY_LABELS[item.category].toUpperCase())).toBeTruthy();
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('calls onPress when pressed', () => {
    renderComponent(item);

    const card = screen.getByRole('button');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalled();
  });
});
