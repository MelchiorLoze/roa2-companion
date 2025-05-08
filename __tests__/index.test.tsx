import { render } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import Index from '@/app/index';

jest.mock('expo-router');
const RedirectMock = jest.mocked(Redirect);

describe('index', () => {
  afterEach(() => {
    RedirectMock.mockClear();
  });

  it('redirects to sign-in page', () => {
    render(<Index />);

    expect(RedirectMock).toHaveBeenCalledWith({ href: '/sign-in' }, {});
  });
});
