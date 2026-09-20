import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Card } from './Card';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
jest.requireMock('@shopify/react-native-skia').useCanvasSize = () => ({
  ref: null,
  size: { width: 0, height: 0 },
});

const onPressMock = jest.fn();

const renderComponent = () => {
  render(
    <Card onPress={onPressMock} role="button">
      {() => <Text>Content</Text>}
    </Card>,
  );

  expect(onPressMock).not.toHaveBeenCalled();
};

describe('Card', () => {
  it('renders children', () => {
    renderComponent();

    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    renderComponent();

    fireEvent.press(screen.getByRole('button'));

    expect(onPressMock).toHaveBeenCalled();
  });

  it('passes pressed state to children', () => {
    let isPressed = true;

    render(
      <Card onPress={onPressMock}>
        {(pressed) => {
          isPressed = pressed;

          return <Text>Content</Text>;
        }}
      </Card>,
    );

    expect(isPressed).toBe(false);
  });
});
