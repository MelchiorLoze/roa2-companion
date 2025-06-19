import { renderHook } from '@testing-library/react-native';
import { useFonts } from 'expo-font';

import { useAppFonts } from './useAppFonts';

jest.mock('expo-font');
const useFontsMock = jest.mocked(useFonts);

describe('useAppFonts', () => {
  it('hides splash screen when fonts are loaded', () => {
    useFontsMock.mockReturnValue([true, null]);

    const onLoadedMock = jest.fn();
    renderHook(() => useAppFonts({ onLoaded: onLoadedMock }));

    expect(onLoadedMock).toHaveBeenCalledTimes(1);
  });

  it('does not hide splash screen when fonts are not loaded yet', () => {
    useFontsMock.mockReturnValue([false, null]);

    const onLoadedMock = jest.fn();
    renderHook(() => useAppFonts({ onLoaded: onLoadedMock }));

    expect(onLoadedMock).toHaveBeenCalledTimes(0);
  });
});
