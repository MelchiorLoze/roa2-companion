import { fireEvent, render, screen } from '@testing-library/react-native';

import { Tab } from './Tab';

const onPressMock = jest.fn();

const renderComponent = (selected: boolean) => {
  render(<Tab label="Test Tab" onPress={onPressMock} selected={selected} />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Tab', () => {
  it('renders the label', () => {
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
    const { rerender } = render(<Tab label="Test Tab" onPress={onPressMock} selected={false} />);
    const unselectedView = screen.toJSON();

    const unselectedTab = screen.getByText('Test Tab');
    expect(unselectedTab).toBeEnabled();

    rerender(<Tab label="Test Tab" onPress={onPressMock} selected={true} />);
    const selectedView = screen.toJSON();
    expect(selectedView).not.toEqual(unselectedView);

    const selectedTab = screen.getByText('Test Tab');
    expect(selectedTab).toBeDisabled();
  });
});
