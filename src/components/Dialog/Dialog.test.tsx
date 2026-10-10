import { fireEvent, render, screen } from '@testing-library/react-native';
import { Keyboard, Text } from 'react-native';

import { Dialog } from './Dialog';

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss');
const keyboardIsVisibleSpy = jest.spyOn(Keyboard, 'isVisible');

describe('Dialog', () => {
  beforeEach(() => {
    keyboardIsVisibleSpy.mockReturnValue(false);
  });

  it('renders correctly', async () => {
    await render(
      <Dialog onClose={jest.fn()}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    expect(screen.getByText('Dialog Content')).toBeTruthy();
    expect(screen.getByTestId('overlay')).toBeTruthy();
  });

  it('renders alert text when provided', async () => {
    await render(
      <Dialog alertText="This is an alert" onClose={jest.fn()}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    expect(screen.getByText('Dialog Content')).toBeTruthy();
    expect(screen.getByText('This is an alert')).toBeTruthy();
  });

  it('calls onClose when overlay is pressed', async () => {
    const mockOnClose = jest.fn();
    await render(
      <Dialog onClose={mockOnClose}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    await fireEvent.press(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('dismisses keyboard when overlay is pressed and keyboard is visible', async () => {
    const mockOnClose = jest.fn();
    await render(
      <Dialog onClose={mockOnClose}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    // Simulate keyboard being visible
    keyboardIsVisibleSpy.mockReturnValue(true);
    await fireEvent.press(screen.getByTestId('overlay'));

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
