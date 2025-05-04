import { fireEvent, render, screen } from '@testing-library/react-native';

import { Input } from './Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input autoComplete="email" onChange={jest.fn()} placeholder="EMAIL" value="kragg@email.com" />);

    const input = screen.getByPlaceholderText('EMAIL');
    expect(input.props.autoComplete).toBe('email');
    expect(input).toHaveDisplayValue('kragg@email.com');
  });

  it('calls onChange when text is entered', () => {
    const mockOnChange = jest.fn();
    render(<Input autoComplete="email" onChange={mockOnChange} placeholder="EMAIL" value="" />);

    const input = screen.getByPlaceholderText('EMAIL');
    fireEvent.changeText(input, 'kragg@example.com');

    expect(mockOnChange).toHaveBeenCalledWith('kragg@example.com');
  });

  it('hides text when hidden prop is true', () => {
    render(
      <Input autoComplete="current-password" hidden onChange={jest.fn()} placeholder="PASSWORD" value="1_L0V3_R0CK5" />,
    );

    const input = screen.getByPlaceholderText('PASSWORD');
    expect(input.props.secureTextEntry).toBe(true);
    expect(input).toHaveDisplayValue('1_L0V3_R0CK5');
  });

  it('displays error message when errorMessage prop is provided', () => {
    render(
      <Input
        autoComplete="email"
        errorMessage="Please provide a valid email"
        onChange={jest.fn()}
        placeholder="EMAIL"
        value=""
      />,
    );

    screen.getByText('Please provide a valid email');
  });

  it('displays contextual CTA when provided', () => {
    const mockOnPress = jest.fn();
    render(
      <Input
        autoComplete="email"
        contextualCTA={{ label: 'Forgot your password?', onPress: mockOnPress }}
        onChange={jest.fn()}
        placeholder="EMAIL"
        value=""
      />,
    );

    const ctaButton = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.press(ctaButton);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
