import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { Keyboard } from 'react-native';

import SignIn from '@/app/sign-in';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { useSendAccountRecoveryEmail } from '@/features/auth/hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail';

jest.mock('expo-router');
jest.mock('@/features/auth/hooks/data/useSendAccountRecoveryEmail/useSendAccountRecoveryEmail');
jest.mock('@/features/auth/hooks/business/useAuth/useAuth');

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss');
const keyboardIsVisibleSpy = jest.spyOn(Keyboard, 'isVisible');

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

  it('matches snapshot', async () => {
    const tree = (await render(<SignIn />)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with password reset dialog open', async () => {
    const result = await render(<SignIn />);

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);

    const tree = result.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    await render(<SignIn />);

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

  it('renders loading state', async () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isLoggedIn: undefined,
      isLoading: true,
    });

    await render(<SignIn />);

    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.queryByText(SCREEN_TITLE)).toBeNull();
  });

  it('shows spinner after submitting valid credentials', async () => {
    await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await fireEvent.changeText(emailInput, 'kragg@example.com');
    await fireEvent.changeText(passwordInput, 'r0ck');
    await fireEvent.press(loginButton);

    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.queryByText(SCREEN_TITLE)).toBeNull();
  });

  it('redirects to store when already logged in', async () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isLoggedIn: true,
    });

    await render(<SignIn />);

    expect(RedirectMock).toHaveBeenCalledTimes(1);
    expect(RedirectMock).toHaveBeenCalledWith({ href: '/store' }, undefined);
    expect(screen.queryByText(SCREEN_TITLE)).toBeNull();
  });

  it('shows an error message when submitting with empty email', async () => {
    await render(<SignIn />);

    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    await fireEvent.changeText(passwordInput, 'r0ck');

    const loginButton = screen.getByRole('button', { name: 'Login' });
    await fireEvent.press(loginButton);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('shows an error message when submitting with empty password', async () => {
    await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    await fireEvent.changeText(emailInput, 'kragg@example.com');

    const loginButton = screen.getByRole('button', { name: 'Login' });
    await fireEvent.press(loginButton);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('shows error message when login fails', async () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthReturnValue,
      isLoggedIn: undefined,
      isError: true,
    });

    await render(<SignIn />);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();
  });

  it('hides spinner and shows error when login request fails', async () => {
    const { rerender } = await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await fireEvent.changeText(emailInput, 'kragg@example.com');
    await fireEvent.changeText(passwordInput, 'r0ck');
    await fireEvent.press(loginButton);

    expect(screen.getByTestId('spinner')).toBeTruthy();

    useAuthMock.mockReturnValue({ ...defaultAuthReturnValue, isLoggedIn: undefined, isError: true });
    await rerender(<SignIn />);

    expect(screen.queryByTestId('spinner')).toBeNull();
    expect(screen.getByText('Invalid email or password')).toBeTruthy();
  });

  it('calls login function with email and password', async () => {
    await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await fireEvent.changeText(emailInput, 'kragg@example.com');
    expect(emailInput).toHaveDisplayValue('kragg@example.com');
    await fireEvent.changeText(passwordInput, 'r0ck');
    expect(passwordInput).toHaveDisplayValue('r0ck');
    await fireEvent.press(loginButton);

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith({
      email: 'kragg@example.com',
      password: 'r0ck',
    });
  });

  it('hides error message when calling login with valid credentials', async () => {
    await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await fireEvent.press(loginButton);
    expect(screen.getByText('Invalid email or password')).toBeTruthy();

    await fireEvent.changeText(emailInput, 'clairen@example.com');
    await fireEvent.changeText(passwordInput, '1MM4TUR3');
    await fireEvent.press(loginButton);

    expect(screen.queryByText('Invalid email or password')).toBeNull();
  });

  it('shows reset password dialog when clicking on forgot password', async () => {
    await render(<SignIn />);

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    expect(
      withinDialog.getByText(
        'After submitting, you will receive an email from Aether Studios allowing you to reset your password',
      ),
    ).toBeTruthy();
    expect(keyboardDismissSpy).not.toHaveBeenCalled();
  });

  it('fills email field when reset password dialog is closed with email', async () => {
    const { rerender } = await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    const resetPasswordEmailInput = withinDialog.getByPlaceholderText('EMAIL');
    await fireEvent.changeText(resetPasswordEmailInput, 'kragg@example.com');

    const resetPasswordButton = withinDialog.getByRole('button', { name: 'Reset password' });
    await fireEvent.press(resetPasswordButton);

    useSendAccountRecoveryEmailMock.mockReturnValue({
      ...defaultSendAccountRecoveryEmailReturnValue,
      isSuccess: true,
    });
    await rerender(<SignIn />);

    const closeButton = withinDialog.getByRole('button', { name: 'Ok' });
    await fireEvent.press(closeButton);

    expect(emailInput).toHaveDisplayValue('kragg@example.com');
  });

  it('clears password field when reset password dialog is closed with email', async () => {
    const { rerender } = await render(<SignIn />);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');

    await fireEvent.changeText(emailInput, 'old@example.com');
    await fireEvent.changeText(passwordInput, 'oldpassword');

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    const resetPasswordEmailInput = withinDialog.getByPlaceholderText('EMAIL');
    await fireEvent.changeText(resetPasswordEmailInput, 'kragg@example.com');

    const resetPasswordButton = withinDialog.getByRole('button', { name: 'Reset password' });
    await fireEvent.press(resetPasswordButton);

    useSendAccountRecoveryEmailMock.mockReturnValue({
      ...defaultSendAccountRecoveryEmailReturnValue,
      isSuccess: true,
    });
    await rerender(<SignIn />);

    const closeButton = withinDialog.getByRole('button', { name: 'Ok' });
    await fireEvent.press(closeButton);

    expect(emailInput).toHaveDisplayValue('kragg@example.com');
    expect(passwordInput).toHaveDisplayValue('');
  });

  it('clears invalid state when opening reset password dialog', async () => {
    await render(<SignIn />);

    const loginButton = screen.getByRole('button', { name: 'Login' });
    await fireEvent.press(loginButton);

    expect(screen.getByText('Invalid email or password')).toBeTruthy();

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);

    // After opening the dialog and closing it, the error should be cleared
    const overlay = screen.getByTestId('overlay');
    await fireEvent.press(overlay);

    expect(screen.queryByText('Invalid email or password')).toBeNull();
  });

  it('dismisses keyboard when opening reset password dialog', async () => {
    await render(<SignIn />);

    keyboardIsVisibleSpy.mockReturnValue(true);

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    await fireEvent.press(forgotPasswordButton);

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1);

    keyboardIsVisibleSpy.mockRestore();
  });
});
