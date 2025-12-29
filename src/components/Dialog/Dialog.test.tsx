import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders correctly', () => {
    render(
      <Dialog onClose={jest.fn()}>
        <Text>Dialog Content</Text>
      </Dialog>,
    );

    expect(screen.getByText('Dialog Content')).toBeTruthy();
    expect(screen.getByTestId('overlay')).toBeTruthy();
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
});
