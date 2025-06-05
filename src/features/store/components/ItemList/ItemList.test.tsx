import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { testItemList } from '@/test-helpers/testItemList';
import { type Item } from '@/types/item';

import { ItemList } from './ItemList';

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
    renderComponent(testItemList);

    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(testItemList.length);
    within(itemCards[0]).getByText(testItemList[0].name);
    within(itemCards[1]).getByText(testItemList[1].name);
  });

  it('calls onSelect when an item is pressed', () => {
    renderComponent(testItemList);

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith(testItemList[0]);
  });
});
