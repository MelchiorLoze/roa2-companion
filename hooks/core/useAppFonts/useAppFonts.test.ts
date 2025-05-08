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
  afterEach(() => {
    SplashScreenMock.hideAsync.mockClear();
  });

  it('should hide splash screen when fonts are loaded', () => {
    useFontsMock.mockReturnValue([true, null]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('should hide splash screen when there is an error loading fonts', () => {
    useFontsMock.mockReturnValue([false, new Error('Failed to load fonts')]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('should not hide splash screen when fonts are not loaded yet', () => {
    useFontsMock.mockReturnValue([false, null]);

    renderHook(useAppFonts);

    expect(SplashScreenMock.hideAsync).not.toHaveBeenCalled();
  });
});
