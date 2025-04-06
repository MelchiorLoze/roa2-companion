import { StyleSheet } from 'react-native-unistyles';

const theme = {
  color: {
    background: '#0E0B2A',
    highlight: '#2B1F74',
    accent: '#FFDF77',
    border: '#CACEFF',
    dark: '#161616',
    weak: '#676767',
    black: 'black',
    white: 'white',
    transparent: 'transparent',
    error: 'crimson',
    // Rarity colors
    common: '#D3D5E4',
    rare: '#447CF1',
    epic: '#C161E5',
    legendary: '#EFDB77',
    // Rank colors
    stone: 'white',
    bronze: 'white',
    silver: 'white',
    gold: '#FFC64E',
    platinum: 'white',
    diamond: '#95DFEC',
    master: '#9CE7AC',
    grandmaster: '#FC7575',
    aetherean: '#BD7CC5',
    // Gradients
    labelGradient: ['transparent', 'black'] as [string, string],
    cardGradient: (pressed?: boolean): [string, string] => (pressed ? ['#F2CF6C', '#CD8944'] : ['#161049', '#0D071D']),
    borderGradient: (pressed?: boolean): [string, string] =>
      pressed ? ['#CD8944', '#F2CF6C'] : ['#CACEFF', '#6B76DC'],
    statsGradient: ['#4B7AB8', 'transparent'] as [string, string],
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    m: 12,
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
