import { fireEvent, render, screen } from '@testing-library/react-native';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<IconButton iconName="home" onPress={mockOnPress} size={24} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
