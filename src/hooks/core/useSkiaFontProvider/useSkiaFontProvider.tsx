import { type DataModule, type SkTypefaceFontProvider, useFonts } from '@shopify/react-native-skia';
import { createContext, type PropsWithChildren, useContext } from 'react';

import { type FontFamily, FONTS } from '@/types/font';

const SKIA_FONTS = Object.entries(FONTS).reduce(
  (acc, [key, value]) => {
    acc[key as FontFamily] = [value as DataModule];
    return acc;
  },
  {} as Record<FontFamily, [DataModule]>,
);

const SkiaFontContext = createContext<SkTypefaceFontProvider | undefined>(undefined);

export const SkiaFontProvider = ({ children }: PropsWithChildren) => {
  const fontProvider = useFonts(SKIA_FONTS);

  if (!fontProvider) return null;

  return <SkiaFontContext.Provider value={fontProvider}>{children}</SkiaFontContext.Provider>;
};

export const useSkiaFontProvider = (): SkTypefaceFontProvider => {
  const fontProvider = useContext(SkiaFontContext);

  if (!fontProvider) throw new Error('useSkiaFontProvider must be used within a SkiaFontProvider');

  return fontProvider;
};
