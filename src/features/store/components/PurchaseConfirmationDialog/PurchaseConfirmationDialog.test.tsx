import { render, screen, userEvent } from '@testing-library/react-native';

import { CurrencyId } from '@/types/currency';
import { Category, Rarity } from '@/types/item';

import { usePurchaseInventoryItems } from '../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { type CoinStoreItem } from '../../types/item';
import { PurchaseConfirmationDialog } from './PurchaseConfirmationDialog';

const user = userEvent.setup();

jest.mock('../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems');
const usePurchaseInventoryItemsMock = jest.mocked(usePurchaseInventoryItems);
const defaultPurchaseReturnValue: ReturnType<typeof usePurchaseInventoryItems> = {
  purchase: jest.fn(),
  isLoading: false,
  isError: false,
};

const mockItem: CoinStoreItem = {
  id: '321',
  imageUrl: new URL('https://www.example.com/items/Icon_item_321.png'),
  name: 'Test Icon',
  category: Category.ICON,
  rarity: Rarity.COMMON,
  coinPrice: 100,
  buckPrice: 10,
};

describe('PurchaseConfirmationDialog', () => {
  beforeEach(() => {
    usePurchaseInventoryItemsMock.mockReturnValue(defaultPurchaseReturnValue);
  });

  it('renders correctly', async () => {
    await render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    expect(usePurchaseInventoryItemsMock).toHaveBeenCalledTimes(1);
    expect(usePurchaseInventoryItemsMock).toHaveBeenCalledWith({ onSuccess: expect.any(Function) });

    expect(screen.getByText('Test Icon')).toBeTruthy();
    expect(screen.getByText('Are you sure you want to buy this icon for 100?')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy();
    expect(screen.getByText("If you have the game opened, don't try to buy the same item twice")).toBeTruthy();
  });

  it('calls onClose when the overlay is pressed', async () => {
    const mockOnClose = jest.fn();
    await render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    await user.press(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when No button is pressed', async () => {
    const mockOnClose = jest.fn();
    await render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls purchase when Yes button is pressed', async () => {
    const mockPurchase = jest.fn();
    usePurchaseInventoryItemsMock.mockImplementation((props) => ({
      ...defaultPurchaseReturnValue,
      purchase: mockPurchase.mockImplementation(props?.onSuccess),
    }));

    const mockOnClose = jest.fn();
    await render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.press(confirmButton);

    expect(mockPurchase).toHaveBeenCalledTimes(1);
    expect(mockPurchase).toHaveBeenCalledWith({
      id: mockItem.id,
      price: { value: mockItem.coinPrice, currencyId: CurrencyId.COINS },
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when purchasing', async () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseReturnValue.purchase,
      isLoading: true,
      isError: false,
    });

    await render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows error message when purchase fails', async () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseReturnValue.purchase,
      isLoading: false,
      isError: true,
    });

    await render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    expect(screen.getByText('Test Icon')).toBeTruthy();
    expect(
      screen.getByText('An error occurred while trying to purchase this item. Do you have enough funds?'),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
    expect(screen.getByText("If you have the game opened, don't try to buy the same item twice")).toBeTruthy();
  });

  it('calls purchase when Retry button is pressed in error state', async () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseReturnValue.purchase,
      isLoading: false,
      isError: true,
    });

    await render(<PurchaseConfirmationDialog item={mockItem} onClose={jest.fn()} />);

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    await user.press(retryButton);

    expect(defaultPurchaseReturnValue.purchase).toHaveBeenCalledTimes(1);
    expect(defaultPurchaseReturnValue.purchase).toHaveBeenCalledWith({
      id: mockItem.id,
      price: { value: mockItem.coinPrice, currencyId: CurrencyId.COINS },
    });
  });

  it('calls onClose when Cancel button is pressed in error state', async () => {
    usePurchaseInventoryItemsMock.mockReturnValue({
      purchase: defaultPurchaseReturnValue.purchase,
      isLoading: false,
      isError: true,
    });

    const mockOnClose = jest.fn();
    await render(<PurchaseConfirmationDialog item={mockItem} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
