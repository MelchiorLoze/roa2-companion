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
  friendlyId: 'DeathEffect_item_1',
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
    expect(item.coinPrice).toBeDefined();
    expect(item.buckPrice).toBeDefined();
  });

  it('renders correctly', () => {
    renderComponent(item);

    screen.getByText(item.name);
    screen.getByText(CATEGORY_LABELS[item.category].toUpperCase());
    screen.getByText(item.coinPrice!.toString());
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('renders correctly when coinPrice is not defined', () => {
    renderComponent({ ...item, coinPrice: undefined });

    screen.getByText(item.name);
    screen.getByText(CATEGORY_LABELS[item.category].toUpperCase());
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('calls onPress when pressed', () => {
    renderComponent(item);

    const card = screen.getByRole('button');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalled();
  });
});
