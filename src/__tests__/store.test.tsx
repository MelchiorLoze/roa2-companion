import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import Store from '@/app/(private)/store';
import { useRotatingCoinShop } from '@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop';
import { testItemList } from '@/test-helpers/testItemList';

jest.mock('expo-router');

jest.mock('@/features/auth/contexts/SessionContext/SessionContext', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

jest.mock('@/features/store/hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems', () => ({
  usePurchaseInventoryItems: () => ({
    purchase: jest.fn(),
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop');
const useRotatingCoinShopMock = jest.mocked(useRotatingCoinShop);

const renderComponent = () => {
  const result = render(<Store />);

  expect(useRotatingCoinShopMock).toHaveBeenCalledTimes(1);

  return result;
};

describe('Store', () => {
  beforeEach(() => {
    useRotatingCoinShopMock.mockReturnValue({
      items: testItemList,
      expirationDate: DateTime.utc().plus({ day: 1 }),
      isLoading: false,
    });
  });

  it('matches the snapshot', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
    useRotatingCoinShopMock.mockReturnValue({
      items: testItemList,
      expirationDate: DateTime.utc().plus({ hours: 15, minutes: 22, seconds: 56 }),
      isLoading: false,
    });

    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();

    jest.useRealTimers();
  });

  it('renders the items of the store', () => {
    renderComponent();

    screen.getByText('Items refresh in:');
    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(testItemList.length);
    within(itemCards[0]).getByText(testItemList[0].name);
    within(itemCards[1]).getByText(testItemList[1].name);

    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(testItemList[0].name);
    withinDialog.getByText('Are you sure you want to buy this icon for 2000?');
    withinDialog.getByRole('button', { name: 'Close' });
    withinDialog.getByRole('button', { name: 'Confirm' });
  });

  it('does not show the confirmation dialog when the selected item does not have a coin price', () => {
    expect(testItemList[1].coinPrice).toBeUndefined();

    renderComponent();

    const itemCards = screen.getAllByRole('button');
    within(itemCards[1]).getByText(testItemList[1].name);

    fireEvent.press(itemCards[1]);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('displays a spinner when the store items are loading', () => {
    useRotatingCoinShopMock.mockReturnValue({
      items: [],
      expirationDate: undefined,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });

  it('hides the confirmation dialog when the close button is pressed', () => {
    renderComponent();

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);

    const dialog = screen.getByTestId('dialog');
    expect(dialog).toBeTruthy();

    const closeButton = within(dialog).getByRole('button', { name: 'Close' });
    fireEvent.press(closeButton);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });
});
