import { render, screen, userEvent } from '@testing-library/react-native';

import { Button } from './Button';

const user = userEvent.setup();

const label = 'My Button';
const onPressMock = jest.fn();

const renderComponent = async () => {
  await render(<Button label={label} onPress={onPressMock} />);

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Button', () => {
  it('calls onPress when pressed', async () => {
    await renderComponent();

    const button = screen.getByRole('button', { name: label });
    await user.press(button);

    expect(onPressMock).toHaveBeenCalled();
  });
});
