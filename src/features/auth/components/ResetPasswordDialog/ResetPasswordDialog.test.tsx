import { fireEvent, render, screen } from '@testing-library/react-native';

import { useSendAccountRecoveryEmail } from '../../hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail';
import { ResetPasswordDialog } from './ResetPasswordDialog';

jest.mock('../../hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail');
const useSendAccountRecoveryEmailMock = jest.mocked(useSendAccountRecoveryEmail);
const defaultSendAccountRecoveryEmailReturnValue: ReturnType<typeof useSendAccountRecoveryEmail> = {
  sendRecoveryEmail: jest.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false,
};

describe('ResetPasswordDialog', () => {
  beforeEach(() => {
    useSendAccountRecoveryEmailMock.mockReturnValue(defaultSendAccountRecoveryEmailReturnValue);
  });

  it('renders correctly', () => {
    render(<ResetPasswordDialog onClose={jest.fn()} />);

    expect(useSendAccountRecoveryEmailMock).toHaveBeenCalledTimes(1);

    screen.getByText(
      'After submitting, you will receive an email from Aether Studios allowing you to reset your password',
    );
    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');
    expect(screen.queryByText('Please provide a valid email')).toBeNull();
    expect(screen.getByRole('button', { name: 'Reset password' })).toBeTruthy();
  });

  it('renders correctly when an email is provided', () => {
    render(<ResetPasswordDialog email="kragg@example.com" onClose={jest.fn()} />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('kragg@example.com');
  });

  it('calls onClose when the overlay is pressed', () => {
    const mockOnClose = jest.fn();
    render(<ResetPasswordDialog onClose={mockOnClose} />);

    fireEvent.press(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls sendRecoveryEmail when the button is pressed', () => {
    render(<ResetPasswordDialog onClose={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: 'Reset password' });
    fireEvent.press(submitButton);
    expect(screen.getByText('Please provide a valid email')).toBeTruthy();

    const emailInput = screen.getByPlaceholderText('EMAIL');
    fireEvent.changeText(emailInput, 'kragg@example.com');
    fireEvent.press(submitButton);
    expect(screen.queryByText('Please provide a valid email')).toBeNull();

    expect(defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail).toHaveBeenCalledTimes(1);
    expect(defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail).toHaveBeenCalledWith('kragg@example.com');
    expect(screen.queryByText('Please provide a valid email')).toBeNull();
  });

  it('shows error message when email is invalid', () => {
    render(<ResetPasswordDialog onClose={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: 'Reset password' });
    fireEvent.press(submitButton);

    expect(screen.getByText('Please provide a valid email')).toBeTruthy();
    expect(defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail).not.toHaveBeenCalled();
  });

  it('shows error message when email is not sent', () => {
    useSendAccountRecoveryEmailMock.mockReturnValue({
      sendRecoveryEmail: defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail,
      isLoading: false,
      isSuccess: false,
      isError: true,
    });

    render(<ResetPasswordDialog onClose={jest.fn()} />);

    expect(screen.getByText('Please provide a valid email')).toBeTruthy();
  });

  it('shows success message when email is sent', () => {
    useSendAccountRecoveryEmailMock.mockReturnValue({
      sendRecoveryEmail: defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail,
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(<ResetPasswordDialog email="kragg@example.com" onClose={jest.fn()} />);

    screen.getByText(
      'Check your inbox, an email sent to kragg@example.com to reset your password! (you may have to wait a couple of minutes until you receive it)',
    );
    expect(screen.getByRole('button', { name: 'Ok' })).toBeTruthy();
  });

  it('shows loading spinner when sending email', () => {
    useSendAccountRecoveryEmailMock.mockReturnValue({
      sendRecoveryEmail: defaultSendAccountRecoveryEmailReturnValue.sendRecoveryEmail,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    render(<ResetPasswordDialog onClose={jest.fn()} />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });
});
