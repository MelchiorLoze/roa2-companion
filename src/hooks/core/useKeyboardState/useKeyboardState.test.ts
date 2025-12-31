import { act, renderHook } from '@testing-library/react-native';
import { Keyboard, type KeyboardEvent } from 'react-native';

import { useKeyboardState } from './useKeyboardState';

jest.mock('react-native', () => ({
  Keyboard: {
    isVisible: jest.fn(),
    addListener: jest.fn(),
  },
}));

const isVisibleMock = jest.mocked(Keyboard.isVisible);
const addListenerMock = jest.mocked(Keyboard.addListener);
const subscriptionRemoveMock = jest.fn();
addListenerMock.mockReturnValue({
  remove: subscriptionRemoveMock,
} as unknown as ReturnType<typeof addListenerMock>);

const mockKeyboardEvent: KeyboardEvent = {
  endCoordinates: { height: 300, screenX: 0, screenY: 500, width: 400 },
  startCoordinates: { height: 0, screenX: 0, screenY: 800, width: 400 },
  duration: 250,
  easing: 'keyboard',
};

const getEventCallback = (eventName: 'keyboardDidShow' | 'keyboardDidHide') => () =>
  addListenerMock.mock.calls.find((call) => call[0] === eventName)?.[1](mockKeyboardEvent);

describe('useKeyboardState', () => {
  beforeEach(() => {
    isVisibleMock.mockReturnValue(false);
  });

  it('returns initial state with current keyboard visibility', () => {
    const { result } = renderHook(useKeyboardState);

    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('initializes with true when keyboard is already visible', () => {
    isVisibleMock.mockReturnValue(true);

    const { result } = renderHook(useKeyboardState);

    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('sets up keyboard event listeners on mount', () => {
    renderHook(useKeyboardState);

    expect(addListenerMock).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function));
    expect(addListenerMock).toHaveBeenCalledWith('keyboardDidHide', expect.any(Function));
    expect(addListenerMock).toHaveBeenCalledTimes(2);
  });

  it('updates state to true when keyboard is shown', () => {
    const { result } = renderHook(useKeyboardState);
    expect(result.current.isKeyboardVisible).toBe(false);

    const showCallback = getEventCallback('keyboardDidShow');
    act(showCallback);

    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('updates state to false when keyboard is hidden', () => {
    isVisibleMock.mockReturnValue(true);

    const { result } = renderHook(useKeyboardState);
    expect(result.current.isKeyboardVisible).toBe(true);

    const hideCallback = getEventCallback('keyboardDidHide');
    act(hideCallback);

    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('handles multiple keyboard show/hide events correctly', () => {
    const { result } = renderHook(useKeyboardState);

    const showCallback = getEventCallback('keyboardDidShow');
    const hideCallback = getEventCallback('keyboardDidHide');

    // Initial state
    expect(result.current.isKeyboardVisible).toBe(false);

    // Show keyboard
    act(showCallback);
    expect(result.current.isKeyboardVisible).toBe(true);

    // Hide keyboard
    act(hideCallback);
    expect(result.current.isKeyboardVisible).toBe(false);

    // Show again
    act(showCallback);
    expect(result.current.isKeyboardVisible).toBe(true);

    // Hide again
    act(hideCallback);
    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('handles consecutive show events without state issues', () => {
    const { result } = renderHook(useKeyboardState);

    const showCallback = getEventCallback('keyboardDidShow');

    act(showCallback);
    expect(result.current.isKeyboardVisible).toBe(true);

    // Second show event (keyboard already shown)
    act(showCallback);
    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('handles consecutive hide events without state issues', () => {
    isVisibleMock.mockReturnValue(true);

    const { result } = renderHook(useKeyboardState);

    const hideCallback = getEventCallback('keyboardDidHide');

    act(hideCallback);
    expect(result.current.isKeyboardVisible).toBe(false);

    // Second hide event (keyboard already hidden)
    act(hideCallback);
    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('removes event listeners on unmount', () => {
    renderHook(useKeyboardState).unmount();

    expect(subscriptionRemoveMock).toHaveBeenCalledTimes(2);
  });
});
