import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { Category, Item, Rarity } from '@/types/store';

import { ItemList } from './ItemList';

const items: Item[] = [
  {
    id: '1',
    title: 'Item 1',
    rarity: Rarity.COMMON,
    category: Category.ICON,
    coinPrice: 2000,
    buckPrice: 20,
  },
  {
    id: '2',
    title: 'Item 2',
    rarity: Rarity.EPIC,
    category: Category.DEATHEFFECT,
    coinPrice: 50000,
    buckPrice: 500,
  },
];
const onSelectMock = jest.fn();

const renderComponent = (items: Item[]) => {
  render(<ItemList items={items} onSelect={onSelectMock} />);

  expect(onSelectMock).not.toHaveBeenCalled();
};

describe('ItemList', () => {
  it('renders correctly an empty item list', () => {
    renderComponent([]);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders correctly items from the list', () => {
    renderComponent(items);

    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(items.length);
    within(itemCards[0]).getByText(items[0].title);
    within(itemCards[1]).getByText(items[1].title);
  });

  it('calls onSelect when an item is pressed', () => {
    renderComponent(items);

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith(items[0]);
  });
});
