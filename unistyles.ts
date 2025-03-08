import { StyleSheet } from 'react-native-unistyles';

const theme = {
  color: {
    background: '#0E0B2A',
    highlight: '#2B1F74',
    accent: '#FFDF77',
    border: '#A0B3D4',
    dark: '#161616',
    weak: '#353535',
    black: 'black',
    white: 'white',
    error: 'crimson',
    danger: 'crimson',
    common: '#D3D5E4',
    rare: '#447CF1',
    epic: '#C161E5',
    legendary: '#FFDF77',
  },
  spacing: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
  },
  font: {
    primary: {
      regular: 'FranklinGothicDemiCond-Regular',
      italic: 'FranklinGothicDemiCond-Italic',
    },
    secondary: {
      bold: 'AgencyFB-Bold',
      black: 'AgencyFB-Black',
    },
  },
};

const appThemes = {
  default: theme,
};

type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: appThemes,
});
