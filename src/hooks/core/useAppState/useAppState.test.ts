import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';

import { useAppState } from './useAppState';

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'unknown',
    addEventListener: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/unbound-method
const addEventListenerMock = jest.mocked(AppState.addEventListener);
const subscriptionRemoveMock = jest.fn();
addEventListenerMock.mockReturnValue({
  remove: subscriptionRemoveMock,
} as unknown as ReturnType<typeof addEventListenerMock>);

const getChangeCallback = () => addEventListenerMock.mock.calls.find((call) => call[0] === 'change')?.[1];

describe('useAppState', () => {
  it('returns initial state with current app state', () => {
    const { result } = renderHook(useAppState);

    expect(result.current).toBe('unknown');
  });

  it('sets up app state change listener on mount', () => {
    renderHook(useAppState);

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates state when app state changes', () => {
    const { result } = renderHook(useAppState);

    const changeCallback = getChangeCallback();

    act(() => changeCallback?.('background'));

    expect(result.current).toBe('background');
  });

  it('handles multiple app state changes correctly', () => {
    const { result } = renderHook(useAppState);

    const changeCallback = getChangeCallback();

    // Initial state
    expect(result.current).toBe('unknown');

    // Background -> Inactive -> Active sequence
    act(() => changeCallback?.('background'));
    expect(result.current).toBe('background');

    act(() => changeCallback?.('inactive'));
    expect(result.current).toBe('inactive');

    act(() => changeCallback?.('active'));
    expect(result.current).toBe('active');
  });

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(useAppState);

    unmount();

    expect(subscriptionRemoveMock).toHaveBeenCalledTimes(1);
  });
});
