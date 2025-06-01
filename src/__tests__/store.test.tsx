import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import Store from '@/app/(private)/store';
import { type Item, usePurchaseInventoryItems, useRotatingCoinShop } from '@/features/store';
import { Category, CATEGORY_LABELS } from '@/features/store/types/item';
import { Rarity } from '@/features/store/types/rarity';
import { CurrencyId } from '@/types/currency';

jest.mock('expo-router');

jest.mock<typeof import('@/features/store')>('@/features/store', () => ({
  ...jest.requireActual('@/features/store'),
  useRotatingCoinShop: jest.fn(),
  usePurchaseInventoryItems: jest.fn(),
}));
const useRotatingCoinShopMock = jest.mocked(useRotatingCoinShop);
const usePurchaseInventoryItemsMock = jest.mocked(usePurchaseInventoryItems);
const purchaseMock = jest.fn();

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
    buckPrice: 500,
  },
];

const confirmationDialogTitle = (item: Item) =>
  `Are you sure you want to buy the ${CATEGORY_LABELS[item.category]} ${item.title} for ${item.coinPrice}?`;

const renderComponent = () => {
  const result = render(<Store />);

  expect(useRotatingCoinShopMock).toHaveBeenCalledTimes(1);
  expect(usePurchaseInventoryItemsMock).toHaveBeenCalledTimes(1);
  expect(purchaseMock).not.toHaveBeenCalled();

  return result;
};

describe('Store', () => {
  beforeEach(() => {
    useRotatingCoinShopMock.mockReturnValue({
      items,
      expirationDate: DateTime.utc().plus({ day: 1 }),
      isLoading: false,
    });
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: purchaseMock,
      isLoading: false,
      isError: false,
    });
  });

  it('matches the snapshot', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the items of the store', () => {
    renderComponent();

    screen.getByText('Items refresh in:');
    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(items.length);
    within(itemCards[0]).getByText(items[0].title);
    within(itemCards[1]).getByText(items[1].title);

    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(confirmationDialogTitle(items[0]));
    withinDialog.getByRole('button', { name: 'Yes' });
    withinDialog.getByRole('button', { name: 'No' });
  });

  it('does not show the confirmation dialog when the selected item does not have a coin price', () => {
    expect(items[1].coinPrice).toBeUndefined();

    renderComponent();

    const itemCards = screen.getAllByRole('button');
    within(itemCards[1]).getByText(items[1].title);

    fireEvent.press(itemCards[1]);

    expect(screen.queryByText(confirmationDialogTitle(items[1]))).toBeNull();
  });

  it('closes the confirmation dialog when the overlay is pressed', () => {
    renderComponent();

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(confirmationDialogTitle(items[0]));

    const overlay = screen.getByTestId('overlay');
    fireEvent.press(overlay);

    expect(screen.queryByText(confirmationDialogTitle(items[0]))).toBeNull();
  });

  it('closes the confirmation dialog when "No" is pressed', () => {
    renderComponent();

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(confirmationDialogTitle(items[0]));

    const noButton = withinDialog.getByRole('button', { name: 'No' });
    fireEvent.press(noButton);

    expect(screen.queryByText(confirmationDialogTitle(items[0]))).toBeNull();
  });

  it('calls purchase when "Yes" is pressed', () => {
    renderComponent();

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(confirmationDialogTitle(items[0]));

    const yesButton = withinDialog.getByRole('button', { name: 'Yes' });
    fireEvent.press(yesButton);

    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      id: items[0].id,
      price: { value: items[0].coinPrice, currencyId: CurrencyId.COINS },
    });
    expect(screen.queryByText(confirmationDialogTitle(items[0]))).toBeNull();
  });

  it('displays a spinner when the store items are loading', () => {
    useRotatingCoinShopMock.mockReturnValue({
      items: [],
      expirationDate: undefined,
      isLoading: true,
    });

    renderComponent();

    screen.getByAccessibilityHint('Loading...');
  });

  it('displays a spinner when the purchase is loading', () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: purchaseMock,
      isLoading: true,
      isError: false,
    });

    renderComponent();

    screen.getByAccessibilityHint('Loading...');
  });
});
