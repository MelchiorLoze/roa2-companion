import { render, screen, userEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { type ComponentProps } from 'react';

import { ActionRow } from './ActionRow';

const user = userEvent.setup();

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

const renderComponent = async (props: ComponentProps<typeof ActionRow>) => {
  await render(<ActionRow {...props} />);

  expect(pushMock).not.toHaveBeenCalled();
  if (props.onPress) expect(props.onPress).not.toHaveBeenCalled();
};

describe('ActionRow', () => {
  it('navigates to the correct URL when link is pressed', async () => {
    await renderComponent(linkProps);

    const link = screen.getByRole('link', { name: linkProps.label });
    await user.press(link);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(linkProps.url.toString());
  });

  it('calls onPress when used as a button', async () => {
    await renderComponent(buttonProps);

    const button = screen.getByRole('button', { name: buttonProps.label });
    await user.press(button);

    expect(pushMock).not.toHaveBeenCalled();
    expect(buttonProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with logo when provided', async () => {
    const propsWithLogo: ComponentProps<typeof ActionRow> = {
      ...linkProps,
      logo: { uri: 'https://example.com/logo.png' },
    };

    const { getByRole } = await render(<ActionRow {...propsWithLogo} />);
    const link = getByRole('link');

    expect(link).toBeDefined();
  });

  it('renders without logo when not provided', async () => {
    const { getByRole } = await render(<ActionRow {...linkProps} />);
    const link = getByRole('link');

    expect(link).toBeDefined();
  });
});
