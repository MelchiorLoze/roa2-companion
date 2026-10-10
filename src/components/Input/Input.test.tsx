import { fireEvent, render, screen } from '@testing-library/react-native';

import { Input } from './Input';

describe('Input', () => {
  it('renders correctly', async () => {
    await render(<Input autoComplete="email" onChange={jest.fn()} placeholder="EMAIL" value="kragg@email.com" />);

    const input = screen.getByPlaceholderText('EMAIL');
    expect(input).toHaveProperty('props', expect.objectContaining({ autoComplete: 'email' }));
    expect(input).toHaveDisplayValue('kragg@email.com');
  });

  it('calls onChange when text is entered', async () => {
    const mockOnChange = jest.fn();
    await render(<Input autoComplete="email" onChange={mockOnChange} placeholder="EMAIL" value="" />);

    const input = screen.getByPlaceholderText('EMAIL');
    await fireEvent.changeText(input, 'kragg@example.com');

    expect(mockOnChange).toHaveBeenCalledWith('kragg@example.com');
  });

  it('hides text when hidden prop is true', async () => {
    await render(
      <Input autoComplete="current-password" hidden onChange={jest.fn()} placeholder="PASSWORD" value="1_L0V3_R0CK5" />,
    );

    const input = screen.getByPlaceholderText('PASSWORD');
    expect(input).toHaveProperty('props', expect.objectContaining({ secureTextEntry: true }));
    expect(input).toHaveDisplayValue('1_L0V3_R0CK5');
  });

  it('displays error message when errorMessage prop is provided', async () => {
    await render(
      <Input
        autoComplete="email"
        errorMessage="Please provide a valid email"
        onChange={jest.fn()}
        placeholder="EMAIL"
        value=""
      />,
    );

    expect(screen.getByText('Please provide a valid email')).toBeTruthy();
  });

  it('displays contextual CTA when provided', async () => {
    const mockOnPress = jest.fn();
    await render(
      <Input
        autoComplete="email"
        contextualCTA={{ label: 'Forgot your password?', onPress: mockOnPress }}
        onChange={jest.fn()}
        placeholder="EMAIL"
        value=""
      />,
    );

    const ctaButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(ctaButton);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
