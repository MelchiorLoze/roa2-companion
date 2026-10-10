import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';

import { useAppState } from './useAppState';

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'unknown',
    addEventListener: jest.fn(),
  },
}));

const addEventListenerMock = jest.mocked(AppState.addEventListener);
const subscriptionRemoveMock = jest.fn();
addEventListenerMock.mockReturnValue({
  remove: subscriptionRemoveMock,
});

const getChangeCallback = () => addEventListenerMock.mock.calls.find((call) => call[0] === 'change')?.[1];

describe('useAppState', () => {
  it('returns initial state with current app state', async () => {
    const { result } = await renderHook(useAppState);

    expect(result.current).toBe('unknown');
  });

  it('sets up app state change listener on mount', async () => {
    await renderHook(useAppState);

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates state when app state changes', async () => {
    const { result } = await renderHook(useAppState);

    const changeCallback = getChangeCallback();

    await act(() => changeCallback?.('background'));

    expect(result.current).toBe('background');
  });

  it('handles multiple app state changes correctly', async () => {
    const { result } = await renderHook(useAppState);

    const changeCallback = getChangeCallback();

    // Initial state
    expect(result.current).toBe('unknown');

    // Background -> Inactive -> Active sequence
    await act(() => changeCallback?.('background'));
    expect(result.current).toBe('background');

    await act(() => changeCallback?.('inactive'));
    expect(result.current).toBe('inactive');

    await act(() => changeCallback?.('active'));
    expect(result.current).toBe('active');
  });

  it('removes event listener on unmount', async () => {
    const { unmount } = await renderHook(useAppState);

    await unmount();

    expect(subscriptionRemoveMock).toHaveBeenCalledTimes(1);
  });
});
