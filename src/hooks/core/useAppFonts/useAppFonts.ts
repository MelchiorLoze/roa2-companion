import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import {
  AgencyFBBlack,
  AgencyFBBold,
  FranklinGothicDemiCondItalic,
  FranklinGothicDemiCondRegular,
} from '@/assets/fonts';

type Props = {
  onLoaded?: () => void;
};

export const useAppFonts = ({ onLoaded }: Props) => {
  const [loaded] = useFonts({
    'AgencyFB-Black': AgencyFBBlack,
    'AgencyFB-Bold': AgencyFBBold,
    'FranklinGothicDemiCond-Italic': FranklinGothicDemiCondItalic,
    'FranklinGothicDemiCond-Regular': FranklinGothicDemiCondRegular,
  });

  useEffect(() => {
    if (loaded) onLoaded?.();
  }, [loaded, onLoaded]);
};
