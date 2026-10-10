import { fireEvent, render, screen } from '@testing-library/react-native';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('calls onPress when pressed', async () => {
    const mockOnPress = jest.fn();
    await render(<IconButton iconName="home" onPress={mockOnPress} size={24} />);

    const button = screen.getByRole('button');
    await fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
