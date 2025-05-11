import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { ComponentProps } from 'react';

import { ActionRow } from './ActionRow';

jest.mock('expo-router');
const useRouterMock = jest.mocked(useRouter);
const pushMock = jest.fn();
useRouterMock.mockReturnValue({
  push: pushMock,
} as unknown as ReturnType<typeof useRouter>);

const linkProps: ComponentProps<typeof ActionRow> = {
  label: 'My Label',
  iconName: 'arrow-outward',
  url: new URL('https://example.com'),
};

const buttonProps: ComponentProps<typeof ActionRow> = {
  ...linkProps,
  url: undefined,
  onPress: jest.fn(),
};

const renderComponent = (props: ComponentProps<typeof ActionRow>) => {
  render(<ActionRow {...props} />);

  expect(pushMock).not.toHaveBeenCalled();
  if (props.onPress) expect(props.onPress).not.toHaveBeenCalled();
};

describe('ActionRow', () => {
  it('navigates to the correct URL when link is pressed', () => {
    renderComponent(linkProps);

    const link = screen.getByRole('link', { name: linkProps.label });
    fireEvent.press(link);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(linkProps.url.toString());
  });

  it('calls onPress when used as a button', () => {
    renderComponent(buttonProps);

    const button = screen.getByRole('button', { name: buttonProps.label });
    fireEvent.press(button);

    expect(pushMock).not.toHaveBeenCalled();
    expect(buttonProps.onPress).toHaveBeenCalledTimes(1);
  });
});
