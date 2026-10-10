import { render } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import Index from '@/app/index';

jest.mock('expo-router');

const RedirectMock = jest.mocked(Redirect);

describe('Index', () => {
  it('matches snapshot', async () => {
    const tree = (await render(<Index />)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('redirects to sign-in page', async () => {
    await render(<Index />);

    expect(RedirectMock).toHaveBeenCalledWith({ href: '/sign-in' }, undefined);
  });
});
