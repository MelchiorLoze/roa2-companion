import { renderHook } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

import { useAppFonts } from './useAppFonts';

jest.mock('expo-font');
const useFontsMock = jest.mocked(useFonts);

jest.mock('expo-router');
const SplashScreenMock = jest.mocked(SplashScreen);
SplashScreenMock.hideAsync = jest.fn();

describe('useAppFonts', () => {
  it('hides splash screen when fonts are loaded', () => {
    useFontsMock.mockReturnValue([true, null]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('hides splash screen when there is an error loading fonts', () => {
    useFontsMock.mockReturnValue([false, new Error('Failed to load fonts')]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('does not hide splash screen when fonts are not loaded yet', () => {
    useFontsMock.mockReturnValue([false, null]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).not.toHaveBeenCalled();
  });
});
