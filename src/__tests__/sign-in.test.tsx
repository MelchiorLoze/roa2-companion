import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import SignIn from '@/app/sign-in';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { useSendAccountRecoveryEmail } from '@/features/auth/hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail';

jest.mock('expo-router');
jest.mock('@/features/auth/hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail');
jest.mock('@/features/auth/hooks/business/useAuth/useAuth');

const RedirectMock = jest.mocked(Redirect);
const useSendAccountRecoveryEmailMock = jest.mocked(useSendAccountRecoveryEmail);
const useAuthMock = jest.mocked(useAuth);

const loginMock = jest.fn();
const sendRecoveryEmailMock = jest.fn();

const defaultSendAccountRecoveryEmailReturnValue: ReturnType<typeof useSendAccountRecoveryEmail> = {
  sendRecoveryEmail: sendRecoveryEmailMock,
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const defaultAuthReturnValue: ReturnType<typeof useAuth> = {
  isLoggedIn: false,
  login: loginMock,
  logout: jest.fn(),
  isLoading: false,
  isError: false,
};

const SCREEN_TITLE = 'Login to your in-game account';

describe('SignIn', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue(defaultAuthReturnValue);
    useSendAccountRecoveryEmailMock.mockReturnValue(defaultSendAccountRecoveryEmailReturnValue);
  });

  it('matches snapshot', () => {
    const tree = render(<SignIn />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with password reset dialog open', () => {
    const result = render(<SignIn />);

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.press(forgotPasswordButton);

    const tree = result.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly', () => {
    render(<SignIn />);

    expect(screen.getByTestId('disclaimer')).toBeTruthy();
    expect(screen.getByText(SCREEN_TITLE)).toBeTruthy();

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    expect(passwordInput).toHaveDisplayValue('');

    expect(screen.queryByText('Invalid email or password')).toBeNull();
    expect(screen.getByRole('button', { name: 'Forgot your password?' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
  });

  it('renders loading state', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isLoading: true,
    });

    render(<SignIn />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.queryByText(SCREEN_TITLE)).toBeNull();
  });

  it('redirects to store when already logged in', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isLoggedIn: true,
    });

    render(<SignIn />);

    expect(RedirectMock).toHaveBeenCalledTimes(1);
    expect(RedirectMock).toHaveBeenCalledWith({ href: '/store' }, undefined);
    expect(screen.queryByText(SCREEN_TITLE)).toBeNull();
  });

  it('shows an error message when submitting with empty email or password', () => {
    render(<SignIn />);

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.press(loginButton);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('shows error message when login fails', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isError: true,
    });

    render(<SignIn />);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();
  });

  it('calls login function with email and password', () => {
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.changeText(emailInput, 'kragg@example.com');
    expect(emailInput).toHaveDisplayValue('kragg@example.com');
    fireEvent.changeText(passwordInput, 'r0ck');
    expect(passwordInput).toHaveDisplayValue('r0ck');
    fireEvent.press(loginButton);

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith({
      email: 'kragg@example.com',
      password: 'r0ck',
    });
  });

  it('hides error message when calling login with valid credentials', () => {
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.press(loginButton);
    expect(screen.getByText('Invalid email or password')).toBeTruthy();

    fireEvent.changeText(emailInput, 'clairen@example.com');
    fireEvent.changeText(passwordInput, '1MM4TUR3');
    fireEvent.press(loginButton);

    expect(screen.queryByText('Invalid email or password')).toBeNull();
  });

  it('shows reset password dialog when clicking on forgot password', () => {
    render(<SignIn />);

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    expect(
      withinDialog.getByText(
        'After submitting, you will receive an email from Aether Studios allowing you to reset your password',
      ),
    ).toBeTruthy();
  });

  it('fills email field when reset password dialog is closed with email', () => {
    const { rerender } = render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    const resetPasswordEmailInput = withinDialog.getByPlaceholderText('EMAIL');
    fireEvent.changeText(resetPasswordEmailInput, 'kragg@example.com');

    const resetPasswordButton = withinDialog.getByRole('button', { name: 'Reset password' });
    fireEvent.press(resetPasswordButton);

    useSendAccountRecoveryEmailMock.mockReturnValue({
      ...defaultSendAccountRecoveryEmailReturnValue,
      isSuccess: true,
    });
    rerender(<SignIn />);

    const closeButton = withinDialog.getByRole('button', { name: 'Ok' });
    fireEvent.press(closeButton);

    expect(emailInput).toHaveDisplayValue('kragg@example.com');
  });
});
