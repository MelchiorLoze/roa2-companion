import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import {
  AgencyFBBlack,
  AgencyFBBold,
  FranklinGothicDemiCondItalic,
  FranklinGothicDemiCondRegular,
} from '@/assets/fonts';

void SplashScreen.preventAutoHideAsync();

export const useAppFonts = () => {
  const [loaded, error] = useFonts({
    'AgencyFB-Black': AgencyFBBlack,
    'AgencyFB-Bold': AgencyFBBold,
    'FranklinGothicDemiCond-Italic': FranklinGothicDemiCondItalic,
    'FranklinGothicDemiCond-Regular': FranklinGothicDemiCondRegular,
  });

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);
};
