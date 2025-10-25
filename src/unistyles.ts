import { StyleSheet } from 'react-native-unistyles';

const theme = {
  color: {
    background: '#0B0825',
    darkBlue: '#070032',
    highlight: '#2B1F74',
    accent: '#FEDD84',
    borderLight: '#CACEFF',
    borderMedium: '#A9AFFF',
    borderDark: '#4838A9',
    dark: '#161616',
    weak: '#676767',
    stat: '#FFBC51',
    inactive: '#5A5C95',
    disabled: '#AAAAAA',
    black: 'black',
    white: 'white',
    transparent: '#FFFFFF00',
    translucentBlack: '#000000AA',
    translucentDark: '#161616AA',
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
    headerGradient: ['#05011A', '#261D43'] as const,
    alertGradient: ['#E3E2E4', '#7C7B87'] as const,
    blackGradient: ['transparent', 'black'] as const,
    storeGradient: ['#4F38D4', '#251A5E'] as const,
    statsGradient: ['#4B7AB8', 'transparent'] as const,
    rankStatPositionGradient: ['#191256', '#271A83'] as const,
    rankStatProfileGradient: ['#1A135A', '#3420AA'] as const,
    rankStatRankGradient: ['#140F46', '#1F1769'] as const,
    statLabelGradient: ['#191256', '#3420AA'] as const,
    statValueGradient: ['#1C1561', '#1F176A'] as const,
    cardGradient: (pressed?: boolean) =>
      pressed ? (['#FFFF8D', '#F1A544'] as const) : (['#161049', '#0D071D'] as const),
    borderGradient: (pressed?: boolean) =>
      pressed ? (['#F1A544', '#FFFF8D'] as const) : (['#CACEFF', '#6B76DC'] as const),
    buttonGradient: (pressed?: boolean) =>
      pressed ? (['#F1A544', '#FFFF8D'] as const) : (['#2D1D76', '#5B73CD'] as const),
    arrowButtonGradient: (pressed?: boolean) =>
      pressed ? (['#F1A544', '#FFFF8D'] as const) : (['#0B0825', '#0B0825'] as const),
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
} as const;

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
