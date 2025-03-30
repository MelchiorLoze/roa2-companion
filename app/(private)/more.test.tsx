import { fireEvent, render, screen } from '@testing-library/react-native';

import { useAuth } from '@/hooks/business';

import More from './more';

jest.mock('../../hooks/business');
const useAuthMock = jest.mocked(useAuth);
const logoutMock = jest.fn();
useAuthMock.mockReturnValue({
  isLoggedIn: true,
  login: jest.fn(),
  logout: logoutMock,
  isLoading: false,
  isError: false,
});

const renderComponent = () => {
  render(<More />);

  expect(useAuthMock).toHaveBeenCalledTimes(1);
  expect(logoutMock).not.toHaveBeenCalled();
};

describe('More', () => {
  afterEach(() => {
    useAuthMock.mockClear();
    logoutMock.mockClear();
  });

  it('renders the list of external links', () => {
    renderComponent();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(6);
  });

  it('calls logout on button press', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: 'Log out' });
    fireEvent.press(button);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
