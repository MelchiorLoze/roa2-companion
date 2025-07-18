import { fireEvent, render, screen } from '@testing-library/react-native';

import { CurrencyId } from '@/types/currency';
import { Category, Rarity } from '@/types/item';

import { usePurchaseInventoryItems } from '../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { type CoinStoreItem } from '../../types/item';
import { PurchaseConfirmationDialog } from './PurchaseConfirmationDialog';

jest.mock('../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems');
const usePurchaseInventoryItemsMock = jest.mocked(usePurchaseInventoryItems);
const defaultPurchaseState: ReturnType<typeof usePurchaseInventoryItems> = {
  purchase: jest.fn(),
  isLoading: false,
  isError: false,
};

const mockItem: CoinStoreItem = {
  id: '321',
  friendlyId: 'Icon_item_321',
  name: 'Test Icon',
  category: Category.ICON,
  rarity: Rarity.COMMON,
  coinPrice: 100,
  buckPrice: 10,
};

describe('PurchaseConfirmationDialog', () => {
  beforeEach(() => {
    usePurchaseInventoryItemsMock.mockReturnValue(defaultPurchaseState);
  });

  it('renders correctly', () => {
    render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    expect(usePurchaseInventoryItemsMock).toHaveBeenCalledTimes(1);
    expect(usePurchaseInventoryItemsMock).toHaveBeenCalledWith({ onSuccess: expect.any(Function) });

    screen.getByText('Test Icon');
    screen.getByText('Are you sure you want to buy this icon for 100?');
    screen.getByRole('button', { name: 'Close' });
    screen.getByRole('button', { name: 'Confirm' });
    screen.getByText("If you have the game opened, don't try to buy the same item twice");
  });

  it('calls onClose when the overlay is pressed', () => {
    const mockOnClose = jest.fn();
    render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    fireEvent.press(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when No button is pressed', () => {
    const mockOnClose = jest.fn();
    render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls purchase when Yes button is pressed', () => {
    const mockPurchase = jest.fn();
    usePurchaseInventoryItemsMock.mockImplementation((props) => ({
      ...defaultPurchaseState,
      purchase: mockPurchase.mockImplementation(props?.onSuccess),
    }));

    const mockOnClose = jest.fn();
    render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    fireEvent.press(confirmButton);

    expect(mockPurchase).toHaveBeenCalledTimes(1);
    expect(mockPurchase).toHaveBeenCalledWith({
      id: mockItem.id,
      price: { value: mockItem.coinPrice, currencyId: CurrencyId.COINS },
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when purchasing', () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseState.purchase,
      isLoading: true,
      isError: false,
    });

    render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    screen.getByTestId('spinner');
  });

  it('shows error message when purchase fails', () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseState.purchase,
      isLoading: false,
      isError: true,
    });

    render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    screen.getByText('Test Icon');
    screen.getByText('An error occurred while trying to purchase this item. Do you have enough funds?');
    screen.getByRole('button', { name: 'Cancel' });
    screen.getByRole('button', { name: 'Retry' });
    screen.getByText("If you have the game opened, don't try to buy the same item twice");
  });

  it('calls purchase when Retry button is pressed in error state', () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseState.purchase,
      isLoading: false,
      isError: true,
    });

    render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.press(retryButton);

    expect(defaultPurchaseState.purchase).toHaveBeenCalledTimes(1);
    expect(defaultPurchaseState.purchase).toHaveBeenCalledWith({
      id: mockItem.id,
      price: { value: mockItem.coinPrice, currencyId: CurrencyId.COINS },
    });
  });

  it('calls onClose when Cancel button is pressed in error state', () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseState.purchase,
      isLoading: false,
      isError: true,
    });

    const mockOnClose = jest.fn();
    render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
