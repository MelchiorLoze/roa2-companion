import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import Store from '@/app/(private)/store';
import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';
import { useRotatingCoinShop } from '@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop';
import { usePurchaseInventoryItems } from '@/features/store/hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { testItemList } from '@/test-helpers/testItemList';

jest.mock('expo-router');
jest.mock('@/features/auth/contexts/SessionContext/SessionContext');
jest.mock('@/features/store/hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems');
jest.mock('@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop');

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
jest.requireMock('@shopify/react-native-skia').useCanvasSize = () => ({
  ref: null,
  size: { width: 0, height: 0 },
});

const useSessionMock = jest.mocked(useSession);
const usePurchaseInventoryItemsMock = jest.mocked(usePurchaseInventoryItems);
const useRotatingCoinShopMock = jest.mocked(useRotatingCoinShop);

const purchaseMock = jest.fn();

const defaultSessionValue: ReturnType<typeof useSession> = {
  isValid: false,
  setSession: jest.fn(),
  clearSession: jest.fn(),
  isLoading: false,
};

const defaultPurchaseInventoryItemsValue: ReturnType<typeof usePurchaseInventoryItems> = {
  purchase: purchaseMock,
  isLoading: false,
  isError: false,
};

const defaultRotatingCoinShopValue: ReturnType<typeof useRotatingCoinShop> = {
  items: testItemList,
  expirationDate: DateTime.utc().plus({ day: 1 }),
  isLoading: false,
};

describe('Store', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue(defaultSessionValue);
    usePurchaseInventoryItemsMock.mockReturnValue(defaultPurchaseInventoryItemsValue);
    useRotatingCoinShopMock.mockReturnValue(defaultRotatingCoinShopValue);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches snapshot', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
    useRotatingCoinShopMock.mockReturnValue({
      ...defaultRotatingCoinShopValue,
      expirationDate: DateTime.utc().plus({ hours: 15, minutes: 22, seconds: 56 }),
    });

    const { toJSON } = render(<Store />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the items of the store', () => {
    render(<Store />);

    expect(screen.getByText('Items refresh in:')).toBeTruthy();
    const itemCards = screen.getAllByRole('button');
    expect(itemCards).toHaveLength(testItemList.length);
    expect(within(itemCards[0]).getByText(testItemList[0].name)).toBeTruthy();
    expect(within(itemCards[1]).getByText(testItemList[1].name)).toBeTruthy();

    fireEvent.press(itemCards[0]);
    const withinDialog = within(screen.getByTestId('dialog'));

    expect(withinDialog.getByText(testItemList[0].name)).toBeTruthy();
    expect(withinDialog.getByText('Are you sure you want to buy this icon for 2000?')).toBeTruthy();
    expect(withinDialog.getByRole('button', { name: 'Close' })).toBeTruthy();
    expect(withinDialog.getByRole('button', { name: 'Confirm' })).toBeTruthy();
  });

  it('does not show the confirmation dialog when the selected item does not have a coin price', () => {
    expect(testItemList[1].coinPrice).toBeUndefined();

    render(<Store />);

    const itemCards = screen.getAllByRole('button');
    expect(within(itemCards[1]).getByText(testItemList[1].name)).toBeTruthy();

    fireEvent.press(itemCards[1]);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('displays a spinner when the store items are loading', () => {
    useRotatingCoinShopMock.mockReturnValue({
      ...defaultRotatingCoinShopValue,
      items: [],
      expirationDate: undefined,
      isLoading: true,
    });

    render(<Store />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('hides the confirmation dialog when the close button is pressed', () => {
    render(<Store />);

    const itemCards = screen.getAllByRole('button');
    fireEvent.press(itemCards[0]);

    const dialog = screen.getByTestId('dialog');
    expect(dialog).toBeTruthy();

    const closeButton = within(dialog).getByRole('button', { name: 'Close' });
    fireEvent.press(closeButton);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });
});
