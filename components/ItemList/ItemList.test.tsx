import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { Item, Rarity } from '@/types/store';

import { ItemList } from './ItemList';

const items: Item[] = [
  {
    id: '1',
    title: 'Item 1',
    rarity: Rarity.COMMON,
    category: 'icon',
    coinPrice: 2000,
    buckPrice: 20,
  },
  {
    id: '2',
    title: 'Item 2',
    rarity: Rarity.EPIC,
    category: 'skin',
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
  afterEach(() => {
    onSelectMock.mockClear();
  });

  it('should render correctly an empty item list', () => {
    renderComponent([]);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render correctly items from the list', () => {
    renderComponent(items);

    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(items.length);
    within(itemCards[0]).getByText(items[0].title);
    within(itemCards[1]).getByText(items[1].title);
  });

  it('should call onSelect when an item is pressed', () => {
    renderComponent(items);

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith(items[0]);
  });
});
