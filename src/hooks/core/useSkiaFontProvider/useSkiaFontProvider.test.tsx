import { type SkTypefaceFontProvider, useFonts } from '@shopify/react-native-skia';
import { render, renderHook, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { SkiaFontProvider, useSkiaFontProvider } from './useSkiaFontProvider';

jest.mock('@shopify/react-native-skia', () => ({
  useFonts: jest.fn(),
}));

const useFontsMock = jest.mocked(useFonts);
const fontProvider = {} as SkTypefaceFontProvider;

const FontProviderConsumer = () => {
  const providedFontProvider = useSkiaFontProvider();

  return <Text>{providedFontProvider === fontProvider ? 'provided' : 'unexpected'}</Text>;
};

describe('useSkiaFontProvider', () => {
  beforeEach(() => {
    useFontsMock.mockReturnValue(fontProvider);
  });

  it('loads the fonts once and provides them to children', async () => {
    await render(
      <SkiaFontProvider>
        <FontProviderConsumer />
      </SkiaFontProvider>,
    );

    expect(useFontsMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('provided')).toBeTruthy();
  });

  it('renders nothing until the fonts are loaded', async () => {
    useFontsMock.mockReturnValue(null);

    const { toJSON } = await render(
      <SkiaFontProvider>
        <Text>child</Text>
      </SkiaFontProvider>,
    );

    expect(toJSON()).toBeNull();
    expect(screen.queryByText('child')).toBeNull();
  });

  it('throws when used outside of a SkiaFontProvider', async () => {
    await expect(renderHook(() => useSkiaFontProvider())).rejects.toThrow(
      'useSkiaFontProvider must be used within a SkiaFontProvider',
    );
  });
});
