import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import SignIn from '@/app/sign-in';
import { useAuth } from '@/hooks/business';
import { useSendAccountRecoveryEmail } from '@/hooks/data';

jest.mock('expo-router');
const RedirectMock = jest.mocked(Redirect);

jest.mock('../hooks/data');
const useSendAccountRecoveryEmailMock = jest.mocked(useSendAccountRecoveryEmail);
const defaultSendRecoveryEmailState = {
  sendRecoveryEmail: jest.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false,
};

jest.mock('../hooks/business');
const useAuthMock = jest.mocked(useAuth);
const loginMock = jest.fn();
const defaultAuthState = {
  isLoggedIn: false,
  login: loginMock,
  logout: jest.fn(),
  isLoading: false,
  isError: false,
};

const screenTitle = 'Login to your ingame account';

const renderComponent = () => {
  const result = render(<SignIn />);

  expect(useAuthMock).toHaveBeenCalledTimes(1);
  expect(loginMock).not.toHaveBeenCalled();

  return result;
};

describe('SignIn', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue(defaultAuthState);
    useSendAccountRecoveryEmailMock.mockReturnValue(defaultSendRecoveryEmailState);
  });

  afterEach(() => {
    RedirectMock.mockClear();
    useAuthMock.mockClear();
    loginMock.mockClear();
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText(screenTitle);

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    expect(passwordInput).toHaveDisplayValue('');
    expect(screen.queryByText('Invalid email or password')).toBeNull();
    screen.getByRole('button', { name: 'Forgot your password?' });

    screen.getByRole('button', { name: 'Login' });
  });

  it('renders loading state', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthState,
      isLoading: true,
    });

    renderComponent();

    screen.getByAccessibilityHint('Loading...');
    expect(screen.queryByText(screenTitle)).toBeNull();
  });

  it('redirects to store when already logged in', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthState,
      isLoggedIn: true,
    });

    renderComponent();

    expect(RedirectMock).toHaveBeenCalledTimes(1);
    expect(RedirectMock).toHaveBeenCalledWith({ href: '/store' }, {});
    expect(screen.queryByText(screenTitle)).toBeNull();
  });

  it('shows an error message when submitting with empty email or password', () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.press(loginButton);

    screen.getByText('Invalid email or password');
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('shows error message when login fails', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthState,
      isError: true,
    });

    renderComponent();

    screen.getByText('Invalid email or password');
  });

  it('calls login function with email and password', () => {
    renderComponent();

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
    renderComponent();

    const emailInput = screen.getByPlaceholderText('EMAIL');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.press(loginButton);
    screen.getByText('Invalid email or password');

    fireEvent.changeText(emailInput, 'clairen@example.com');
    fireEvent.changeText(passwordInput, '1MM4TUR3');
    fireEvent.press(loginButton);

    expect(screen.queryByText('Invalid email or password')).toBeNull();
  });

  it('shows reset password dialog when clicking on forgot password', () => {
    renderComponent();

    const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot your password?' });
    fireEvent.press(forgotPasswordButton);
    const withinDialog = within(screen.getByTestId('dialog'));

    withinDialog.getByText(
      'After submitting, you will receive an email from Aether Studios allowing you to reset your password',
    );
  });

  it('fills email field when reset password dialog is closed with email', () => {
    const { rerender } = renderComponent();

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
      ...defaultSendRecoveryEmailState,
      isSuccess: true,
    });
    rerender(<SignIn />);

    const closeButton = withinDialog.getByRole('button', { name: 'Ok' });
    fireEvent.press(closeButton);

    expect(emailInput).toHaveDisplayValue('kragg@example.com');
  });
});
