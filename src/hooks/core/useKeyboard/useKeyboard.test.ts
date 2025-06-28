import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Keyboard, type KeyboardEvent } from 'react-native';

import { useKeyboard } from './useKeyboard';

jest.mock('react-native', () => ({
  Keyboard: {
    addListener: jest.fn(),
  },
}));

const addListenerMock = jest.mocked(Keyboard.addListener);
const subscriptionRemoveMock = jest.fn();
addListenerMock.mockReturnValue({
  remove: subscriptionRemoveMock,
} as unknown as ReturnType<typeof addListenerMock>);

const getEventCallback = (eventName: 'keyboardDidShow' | 'keyboardDidHide') => () =>
  addListenerMock.mock.calls.find((call) => call[0] === eventName)?.[1]?.({} as unknown as KeyboardEvent);

describe('useKeyboard', () => {
  it('returns initial state with keyboard hidden', () => {
    const { result } = renderHook(useKeyboard);

    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('sets up keyboard event listeners on mount', () => {
    renderHook(useKeyboard);

    expect(addListenerMock).toHaveBeenCalledTimes(2);
    expect(addListenerMock).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function));
    expect(addListenerMock).toHaveBeenCalledWith('keyboardDidHide', expect.any(Function));
  });

  it('updates state when keyboard is shown', async () => {
    const { result } = renderHook(useKeyboard);

    const showCallback = getEventCallback('keyboardDidShow');
    expect(showCallback).toBeDefined();

    act(() => showCallback?.());

    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(true));
  });

  it('updates state when keyboard is hidden', async () => {
    const { result } = renderHook(useKeyboard);

    const showCallback = getEventCallback('keyboardDidShow');
    const hideCallback = getEventCallback('keyboardDidHide');

    expect(showCallback).toBeDefined();
    expect(hideCallback).toBeDefined();

    // Show keyboard first
    act(() => showCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(true));

    // Then hide keyboard
    act(() => hideCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(false));
  });

  it('removes event listeners on unmount', () => {
    const { unmount } = renderHook(useKeyboard);

    unmount();

    expect(subscriptionRemoveMock).toHaveBeenCalledTimes(2);
  });

  it('handles multiple show/hide events correctly', async () => {
    const { result } = renderHook(useKeyboard);

    const showCallback = getEventCallback('keyboardDidShow');
    const hideCallback = getEventCallback('keyboardDidHide');

    // Initial state
    expect(result.current.isKeyboardVisible).toBe(false);

    // Show -> Hide -> Show -> Hide sequence
    act(() => showCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(true));

    act(() => hideCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(false));

    act(() => showCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(true));

    act(() => hideCallback?.());
    await waitFor(() => expect(result.current.isKeyboardVisible).toBe(false));
  });
});
