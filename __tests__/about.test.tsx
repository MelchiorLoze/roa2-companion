import { render } from '@testing-library/react-native';

import About from '@/app/about';

const renderComponent = () => {
  return render(<About />);
};

describe('About', () => {
  it('matches the snapshot', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });
});
