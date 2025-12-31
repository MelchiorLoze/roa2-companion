import { fireEvent, render, screen } from '@testing-library/react-native';
import { Keyboard, Text } from 'react-native';

import { Dialog } from './Dialog';

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss');
const keyboardIsVisibleSpy = jest.spyOn(Keyboard, 'isVisible');

describe('Dialog', () => {
  beforeEach(() => {
    keyboardIsVisibleSpy.mockReturnValue(false);
  });

  it('renders correctly', () => {
    render(
      <Dialog onClose={jest.fn()}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    expect(screen.getByText('Dialog Content')).toBeTruthy();
    expect(screen.getByTestId('overlay')).toBeTruthy();
  });

  it('renders alert text when provided', () => {
    render(
      <Dialog alertText="This is an alert" onClose={jest.fn()}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    expect(screen.getByText('Dialog Content')).toBeTruthy();
    expect(screen.getByText('This is an alert')).toBeTruthy();
  });

  it('calls onClose when overlay is pressed', () => {
    const mockOnClose = jest.fn();
    render(
      <Dialog onClose={mockOnClose}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    fireEvent.press(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('dismisses keyboard when overlay is pressed and keyboard is visible', () => {
    const mockOnClose = jest.fn();
    render(
      <Dialog onClose={mockOnClose}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    // Simulate keyboard being visible
    keyboardIsVisibleSpy.mockReturnValue(true);
    fireEvent.press(screen.getByTestId('overlay'));

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
