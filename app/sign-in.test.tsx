import { fireEvent, render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/business';

import SignIn from './sign-in';

jest.mock('expo-router');
const RedirectMock = jest.mocked(Redirect);

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

const renderComponent = () => {
  render(<SignIn />);

  expect(useAuthMock).toHaveBeenCalledTimes(1);
  expect(loginMock).not.toHaveBeenCalled();
};

describe('SignIn', () => {
  beforeEach(() => {
    useAuthMock.mockReturnValue(defaultAuthState);
  });

  afterEach(() => {
    RedirectMock.mockClear();
    useAuthMock.mockClear();
    loginMock.mockClear();
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText('Login with your ingame account');

    const emailInput = screen.getByPlaceholderText('EMAIL');
    expect(emailInput).toHaveDisplayValue('');
    const passwordInput = screen.getByPlaceholderText('PASSWORD');
    expect(passwordInput).toHaveDisplayValue('');
    expect(screen.queryByText('Invalid email or password')).toBeNull();

    screen.getByRole('button', { name: 'Login' });
  });

  it('renders loading state', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthState,
      isLoading: true,
    });

    renderComponent();

    screen.getByAccessibilityHint('Loading...');
    expect(screen.queryByText('Login with your ingame account')).toBeNull();
  });

  it('redirects to store when already logged in', () => {
    useAuthMock.mockReturnValue({
      ...defaultAuthState,
      isLoggedIn: true,
    });

    renderComponent();

    expect(RedirectMock).toHaveBeenCalledTimes(1);
    expect(RedirectMock).toHaveBeenCalledWith({ href: '/store' }, {});
    expect(screen.queryByText('Login with your ingame account')).toBeNull();
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
});
