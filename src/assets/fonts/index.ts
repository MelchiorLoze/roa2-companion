import { type FontSource } from 'expo-font';

const AgencyFBBlack: FontSource = require('./AgencyFB-Black.otf');
const AgencyFBBold: FontSource = require('./AgencyFB-Bold.ttf');

const FranklinGothicDemiCondItalic: FontSource = require('./FranklinGothicDemiCond-Italic.otf');
const FranklinGothicDemiCondRegular: FontSource = require('./FranklinGothicDemiCond-Regular.ttf');

export const FONTS: Record<FontFamily, FontSource> = {
  'AgencyFB-Black': AgencyFBBlack,
  'AgencyFB-Bold': AgencyFBBold,
  'FranklinGothicDemiCond-Italic': FranklinGothicDemiCondItalic,
  'FranklinGothicDemiCond-Regular': FranklinGothicDemiCondRegular,
};
