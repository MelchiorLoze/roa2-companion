import { fireEvent, render, screen } from '@testing-library/react-native';

import { Tabs } from './Tabs';

const onPressTab1Mock = jest.fn();
const onPressTab2Mock = jest.fn();
const onPressTab3Mock = jest.fn();

const tabs = [
  { title: 'Tab 1', onPress: onPressTab1Mock },
  { title: 'Tab 2', onPress: onPressTab2Mock },
  { title: 'Tab 3', onPress: onPressTab3Mock },
];

const renderComponent = (selectedTab: string) => {
  render(<Tabs selectedTab={selectedTab} tabs={tabs} />);

  expect(onPressTab1Mock).not.toHaveBeenCalled();
  expect(onPressTab2Mock).not.toHaveBeenCalled();
  expect(onPressTab3Mock).not.toHaveBeenCalled();
};

describe('Tabs', () => {
  it('renders all tabs', () => {
    renderComponent('Tab 1');

    expect(screen.getByText('Tab 1')).toBeDisabled();
    expect(screen.getByText('Tab 2')).toBeEnabled();
    expect(screen.getByText('Tab 3')).toBeEnabled();
  });

  it('calls the correct onPress when a tab is pressed', () => {
    renderComponent('Tab 1');

    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    const tab3 = screen.getByText('Tab 3');

    fireEvent.press(tab1);
    expect(onPressTab1Mock).not.toHaveBeenCalled();
    expect(onPressTab2Mock).not.toHaveBeenCalled();
    expect(onPressTab3Mock).not.toHaveBeenCalled();

    fireEvent.press(tab2);
    expect(onPressTab1Mock).not.toHaveBeenCalled();
    expect(onPressTab2Mock).toHaveBeenCalledTimes(1);
    expect(onPressTab3Mock).not.toHaveBeenCalled();

    fireEvent.press(tab3);
    expect(onPressTab1Mock).not.toHaveBeenCalled();
    expect(onPressTab2Mock).toHaveBeenCalledTimes(1);
    expect(onPressTab3Mock).toHaveBeenCalledTimes(1);
  });

  it('renders differently when selectedTab changes', () => {
    const { rerender } = render(<Tabs selectedTab="Tab 1" tabs={tabs} />);
    const tab1Selected = screen.toJSON();
    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByText('Tab 2');
    expect(tab1).toBeDisabled();
    expect(tab2).toBeEnabled();

    rerender(<Tabs selectedTab="Tab 2" tabs={tabs} />);
    const tab2Selected = screen.toJSON();

    expect(tab1Selected).not.toEqual(tab2Selected);
    expect(tab1).toBeEnabled();
    expect(tab2).toBeDisabled();
  });

  it('renders with two tabs', () => {
    const twoTabs = [
      { title: 'Active', onPress: jest.fn() },
      { title: 'Past', onPress: jest.fn() },
    ];

    render(<Tabs selectedTab="Active" tabs={twoTabs} />);

    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('Past')).toBeTruthy();
  });
});
