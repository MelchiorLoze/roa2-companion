import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import More from '@/app/(private)/more';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';

jest.mock('expo-router');
const useRouterMock = jest.mocked(useRouter);
const navigateMock = jest.fn();
useRouterMock.mockReturnValue({
  navigate: navigateMock,
} as unknown as ReturnType<typeof useRouter>);

jest.mock('@/features/auth/hooks/business/useAuth/useAuth');
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
  const result = render(<More />);

  expect(useAuthMock).toHaveBeenCalledTimes(1);
  expect(logoutMock).not.toHaveBeenCalled();

  return result;
};

describe('More', () => {
  it('matches the snapshot', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the list of external links', () => {
    renderComponent();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(5);
  });

  it('navigates to about page on button press', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: 'About this app' });
    fireEvent.press(button);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/about');
  });

  it('calls logout on button press', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: 'Log out' });
    fireEvent.press(button);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
