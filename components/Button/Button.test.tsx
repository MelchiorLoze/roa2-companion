import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './Button';

const label = 'My Button';
const onPressMock = jest.fn();

const renderComponent = () => {
  render(<Button label={label} onPress={onPressMock} />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Button', () => {
  afterEach(() => {
    onPressMock.mockClear();
  });

  it('should call onPress when pressed', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: label });
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalled();
  });
});
