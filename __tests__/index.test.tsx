import { render } from '@testing-library/react-native';
import { Redirect } from 'expo-router';

import Index from '@/app/index';

jest.mock('expo-router');
const RedirectMock = jest.mocked(Redirect);

const renderComponent = () => {
  return render(<Index />);
};

describe('index', () => {
  it('matches the snapshot', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('redirects to sign-in page', () => {
    renderComponent();

    expect(RedirectMock).toHaveBeenCalledWith({ href: '/sign-in' }, {});
  });
});
