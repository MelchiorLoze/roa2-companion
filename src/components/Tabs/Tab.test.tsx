import { render, screen, userEvent } from '@testing-library/react-native';

import { Tab } from './Tab';

const user = userEvent.setup();

const onPressMock = jest.fn();

const renderComponent = async (selected: boolean) => {
  await render(<Tab label="Test Tab" onPress={onPressMock} selected={selected} />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Tab', () => {
  it('renders the label', async () => {
    await renderComponent(false);

    expect(screen.getByText('Test Tab')).toBeEnabled();
  });

  it('calls onPress when pressed', async () => {
    await renderComponent(false);

    const tab = screen.getByText('Test Tab');
    await user.press(tab);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders differently when selected', async () => {
    const { rerender } = await render(<Tab label="Test Tab" onPress={onPressMock} selected={false} />);
    const unselectedView = screen.toJSON();

    const unselectedTab = screen.getByText('Test Tab');
    expect(unselectedTab).toBeEnabled();

    await rerender(<Tab label="Test Tab" onPress={onPressMock} selected={true} />);
    const selectedView = screen.toJSON();
    expect(selectedView).not.toEqual(unselectedView);

    const selectedTab = screen.getByText('Test Tab');
    expect(selectedTab).toBeDisabled();
  });
});
