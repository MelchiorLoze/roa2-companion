import { fireEvent, render, screen } from '@testing-library/react-native';

import { Tab } from './Tab';

const onPressMock = jest.fn();

const renderComponent = (selected: boolean) => {
  render(<Tab onPress={onPressMock} selected={selected} title="Test Tab" />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Tab', () => {
  it('renders the title', () => {
    renderComponent(false);

    expect(screen.getByText('Test Tab')).toBeEnabled();
  });

  it('calls onPress when pressed', () => {
    renderComponent(false);

    const tab = screen.getByText('Test Tab');
    fireEvent.press(tab);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders differently when selected', () => {
    const { rerender } = render(<Tab onPress={onPressMock} selected={false} title="Test Tab" />);
    const unselectedView = screen.toJSON();
    const tab = screen.getByText('Test Tab');
    expect(tab).toBeEnabled();

    rerender(<Tab onPress={onPressMock} selected={true} title="Test Tab" />);
    const selectedView = screen.toJSON();

    expect(unselectedView).not.toEqual(selectedView);
    expect(tab).toBeDisabled();
  });
});
