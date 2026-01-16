import { StyleSheet } from 'react-native-unistyles';

type GradientProperties = {
  direction: 'horizontal' | 'vertical';
  start?: number;
  end?: number;
};

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
    inactive: '#5a5c95ff',
    inactiveLight: '#888BE0',
    disabled: '#AAAAAA',
    upcoming: '#CACEFF',
    ongoing: '#FEDD84',
    completed: '#FC7575',
    black: 'black',
    white: 'white',
    transparent: '#FFFFFF00',
    translucentBlack: '#000000AA',
    translucentDark: '#161616AA',
    error: '#BA1A27',
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
    storeGradient: ['#4F38D4BF', '#251A5EBF'] as const,
    rankStatPositionGradient: ['#191256', '#271A83'] as const,
    rankStatProfileGradient: ['#1A135A', '#3420AA'] as const,
    rankStatRankGradient: ['#140F46', '#1F1769'] as const,
    statLabelGradient: ['#191256', '#3420AA'] as const,
    statValueGradient: ['#1C1561', '#1F176A'] as const,
    cardGradient: (pressed?: boolean) =>
      pressed ? (['#FDD66D', '#F1A747'] as const) : (['#161049', '#0D071D'] as const),
    borderGradient: (pressed?: boolean) =>
      pressed ? (['#F1A747', '#FDD66D'] as const) : (['#CACEFF', '#6B76DB'] as const),
    buttonGradient: (pressed?: boolean) =>
      pressed ? (['#F1A747', '#FDD66D'] as const) : (['#2D1E7C', '#5B74D7'] as const),
    arrowButtonGradient: (pressed?: boolean) =>
      pressed ? (['#F1A747', '#FDD66D'] as const) : (['#0D071D', '#161049'] as const),
    tabGradient: (selected: boolean) =>
      selected ? (['#342F94', '#69506A'] as const) : (['#342F94', 'transparent'] as const),
    tabUnderlineGradient: ['#69506A', '#F1E8DA', '#F1E8DA', '#69506A'] as const,
    seasonTitleWrapperGradient: (crews = false) =>
      crews ? (['#5DB0CE', '#FFFFFF00'] as const) : (['#DE4434', '#FFFFFF00'] as const),
    seasonTitleGradient: (crews = false) =>
      crews ? (['#304670', '#3D3990'] as const) : (['#75112E', '#BA1A27'] as const),
    gradient: {
      properties: ({ direction, start = 0, end = 1 }: GradientProperties) =>
        direction === 'horizontal'
          ? ({ start: { x: start, y: 0 }, end: { x: end, y: 0 } } as const)
          : ({ start: { x: 0, y: start }, end: { x: 0, y: end } } as const),
      stats: {
        // Values found from game mod kit LeaderboardBgCurve color curve
        colors: ['#3960B0', '#63A5EC', '#63A5EC', '#385E8649', '#385E8600'] as const,
        times: [-0.025, 0.027, 0.207, 0.78, 1.093] as const,
      },
    },
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
