import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { FONTS } from '@/assets/fonts';

type Props = {
  onLoaded?: () => void;
};

export const useAppFonts = ({ onLoaded }: Readonly<Props>): void => {
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    if (loaded) onLoaded?.();
  }, [loaded, onLoaded]);
};
