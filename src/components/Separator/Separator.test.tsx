import { render } from '@testing-library/react-native';

import { Separator } from './Separator';

const renderComponent = (variant?: 'borderLight' | 'accent' | 'gradient', pressed?: boolean, height?: number) => {
  return render(<Separator height={height} pressed={pressed} variant={variant} />);
};

describe('Separator', () => {
  it('renders correctly with default props', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with borderLight variant', () => {
    const tree = renderComponent('borderLight').toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with accent variant', () => {
    const tree = renderComponent('accent').toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with gradient variant', () => {
    const tree = renderComponent('gradient').toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when pressed', () => {
    const tree = renderComponent('gradient', true).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with custom height', () => {
    const tree = renderComponent('borderLight', false, 5).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
