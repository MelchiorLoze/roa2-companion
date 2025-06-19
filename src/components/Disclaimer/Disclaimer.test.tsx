import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { Disclaimer } from './Disclaimer';

const disclaimerText = `This project is a fan-made creation and is not affiliated with Aether Studios or Offbrand Games in any official capacity. The app works directly between your device and the official game servers, with no third parties involved in transferring or processing your data. Learn more...`;

jest.mock('expo-router');
const useRouterMock = jest.mocked(useRouter);
const navigateMock = jest.fn();
useRouterMock.mockReturnValue({
  navigate: navigateMock,
} as unknown as ReturnType<typeof useRouter>);

describe('Disclaimer', () => {
  it('renders correctly', () => {
    render(<Disclaimer />);

    screen.getByTestId('disclaimer');
    screen.getByText(disclaimerText);
  });

  it('navigates to /about on press', () => {
    render(<Disclaimer />);

    const disclaimerButton = screen.getByText(disclaimerText);
    fireEvent.press(disclaimerButton);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/about');
  });
});
