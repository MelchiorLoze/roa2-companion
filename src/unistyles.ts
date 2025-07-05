import { StyleSheet } from 'react-native-unistyles';

const theme = {
  color: {
    background: '#0E0B2A',
    highlight: '#2B1F74',
    accent: '#FFDF77',
    border: '#CACEFF',
    dark: '#161616',
    weak: '#676767',
    disabled: '#AAAAAA',
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
    stone: '#7F7A66',
    bronze: '#B87A2E',
    silver: '#C8C8D5',
    gold: '#FFC64E',
    platinum: '#C3C4FF',
    diamond: '#95DFEC',
    master: '#9CE7AC',
    grandmaster: '#FC7575',
    aetherean: '#BD7CC5',
    // Gradients
    alertGradient: ['#E3E2E4', '#7C7B87'] as const,
    labelGradient: ['transparent', 'black'] as const,
    statsGradient: ['#4B7AB8', 'transparent'] as const,
    cardGradient: (pressed?: boolean) =>
      pressed ? (['#F2CF6C', '#CD8944'] as const) : (['#161049', '#0D071D'] as const),
    borderGradient: (pressed?: boolean) =>
      pressed ? (['#CD8944', '#F2CF6C'] as const) : (['#CACEFF', '#6B76DC'] as const),
    buttonGradient: (pressed?: boolean) =>
      pressed ? (['#F1A544', '#FFFF8D'] as const) : (['#2D1D76', '#5B73CD'] as const),
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: appThemes,
});
