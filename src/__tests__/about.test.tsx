import { render } from '@testing-library/react-native';

import About from '@/app/about';

describe('About', () => {
  it('matches snapshot', async () => {
    const tree = (await render(<About />)).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
