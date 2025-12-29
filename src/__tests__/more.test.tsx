import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import More from '@/app/(private)/more';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';

jest.mock('expo-router');
jest.mock('@/features/auth/hooks/business/useAuth/useAuth');

const useRouterMock = jest.mocked(useRouter);
const useAuthMock = jest.mocked(useAuth);

const navigateMock = jest.fn();
const logoutMock = jest.fn();

const defaultAuthReturnValue: ReturnType<typeof useAuth> = {
  isLoggedIn: true,
  login: jest.fn(),
  logout: logoutMock,
  isLoading: false,
  isError: false,
};

describe('More', () => {
  beforeEach(() => {
    useRouterMock.mockReturnValue({
      navigate: navigateMock,
    } as unknown as ReturnType<typeof useRouter>);

    useAuthMock.mockReturnValue(defaultAuthReturnValue);
  });

  it('matches snapshot', () => {
    const tree = render(<More />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the list of external links', () => {
    render(<More />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(4);
  });

  it('navigates to about page on button press', () => {
    render(<More />);

    const button = screen.getByRole('button', { name: 'About this app' });
    fireEvent.press(button);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/about');
  });

  it('calls logout on button press', () => {
    render(<More />);

    const button = screen.getByRole('button', { name: 'Log out' });
    fireEvent.press(button);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
