import { type FontSource } from 'expo-font';

import {
  AgencyFBBlack,
  AgencyFBBold,
  AgencyFBBoldWide,
  FranklinGothicDemiCondItalic,
  FranklinGothicDemiCondRegular,
} from '@/assets/fonts';

type PrimaryFontFamily = Theme['font']['primary'];
type SecondaryFontFamily = Theme['font']['secondary'];

export type FontFamily = PrimaryFontFamily[keyof PrimaryFontFamily] | SecondaryFontFamily[keyof SecondaryFontFamily];

export const FONTS = Object.freeze<Record<FontFamily, FontSource>>({
  'AgencyFB-Black': AgencyFBBlack,
  'AgencyFB-Bold': AgencyFBBold,
  'AgencyFB-BoldWide': AgencyFBBoldWide,
  'FranklinGothicDemiCond-Italic': FranklinGothicDemiCondItalic,
  'FranklinGothicDemiCond-Regular': FranklinGothicDemiCondRegular,
});
