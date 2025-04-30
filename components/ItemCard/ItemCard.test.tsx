import { fireEvent, render, screen } from '@testing-library/react-native';

import { Category, Item, Rarity } from '@/types/store';

import { ItemCard } from './ItemCard';

const item: Item = {
  id: '1',
  title: 'Item Title',
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

  afterEach(() => {
    onPressMock.mockClear();
  });

  it('should render correctly', () => {
    renderComponent(item);

    screen.getByText(item.title);
    // screen.getByText(CATEGORY_LABELS[item.category]); // TODO: fix react-native-skia setup in tests
    screen.getByText(item.coinPrice!.toString());
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('should render correctly when coinPrice is not defined', () => {
    renderComponent({ ...item, coinPrice: undefined });

    screen.getByText(item.title);
    // screen.getByText(CATEGORY_LABELS[item.category]); // TODO: fix react-native-skia setup in tests
    expect(screen.queryByText(item.buckPrice!.toString())).toBeNull();
  });

  it('should call onPress when pressed', () => {
    renderComponent(item);

    const card = screen.getByRole('button');
    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalled();
  });
});
