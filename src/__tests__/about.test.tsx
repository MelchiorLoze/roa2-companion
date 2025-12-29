import { render } from '@testing-library/react-native';

import About from '@/app/about';

describe('About', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(<About />);

    expect(toJSON()).toMatchSnapshot();
  });
});
