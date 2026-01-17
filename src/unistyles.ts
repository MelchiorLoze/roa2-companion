import { StyleSheet } from 'react-native-unistyles';

type CoordinatesProps = {
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
    inactive: '#5A5C95',
    inactiveLight: '#5F46C2',
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
    gradient: {
      coordinates: ({ direction, start = 0, end = 1 }: CoordinatesProps) =>
        direction === 'horizontal'
          ? ({ start: { x: start, y: 0 }, end: { x: end, y: 0 } } as const)
          : ({ start: { x: 0, y: start }, end: { x: 0, y: end } } as const),
      black: {
        colors: ['#00000000', '#000000FF'],
      },
      header: {
        colors: ['#130F2C00', '#AB91E833'],
        background: '#05011A',
      },
      button: {
        colors: (pressed?: boolean) =>
          pressed ? (['#F1A747', '#FDD66D'] as const) : (['#2D1E7C', '#5B74D7'] as const),
      },
      arrowButton: {
        colors: (pressed?: boolean) =>
          pressed ? (['#F1A747', '#FDD66D'] as const) : (['#0D071D', '#161049'] as const),
      },
      card: {
        colors: (pressed?: boolean) =>
          pressed ? (['#FDD66D', '#F1A747'] as const) : (['#161049', '#0D071D'] as const),
      },
      border: {
        colors: (pressed?: boolean) =>
          pressed ? (['#F1A747', '#FDD66D'] as const) : (['#CACEFF', '#6B76DB'] as const),
      },
      tab: {
        colors: ['#302281E6', '#261365E6'],
      },
      tabSelectedOverlay: {
        // Rivals of Aether II Mod Kit - NavBarButtonOpenCurve
        colors: ['#D9D9D900', '#FAD1684D'],
      },
      tabSelectedGoldAccent: {
        // Rivals of Aether II Mod Kit - NavBarButtonOpenAccentCurve
        colors: ['#D9D9D900', '#FFDB8EB3', '#FFDB8EB3', '#D9D9D900'],
        times: [0, 0.3, 0.7, 1],
      },
      tabSelectedWhiteAccent: {
        // Rivals of Aether II Mod Kit - NavBarButtonOpenAccentWhiteCurve
        colors: ['#D9D9D900', '#FFFFFFB3', '#FFFFFFB3', '#D9D9D900'],
        times: [0, 0.3, 0.7, 1],
      },
      alert: {
        // TODO: Verify colors
        colors: ['#E3E2E4', '#7C7B87'],
      },
      store: {
        colors: ['#4F38D4BF', '#251A5EBF'],
      },
      stats: {
        // Rivals of Aether II Mod Kit - LeaderboardBgCurve
        colors: ['#3960B0B3', '#63A5ECB3', '#63A5ECB3', '#385E8633', '#385E8600'],
        times: [-0.025, 0.027, 0.207, 0.78, 1.093],
      },
      statRowBackground: {
        colors: ['#191256', '#1F176A'],
      },
      statRowOverlay: {
        colors: ['#1C156100', '#3420ABFF'],
      },
      statPositionOverlay: {
        colors: ['#1C156100', '#3420AB83'],
      },
      statRankOverlay: {
        colors: ['#000000FF', '#00000000'],
        times: [-0.693334, 0.306666],
      },
      seasonTitleWrapper: {
        colors: (crews = false) =>
          crews ? (['#65CADAFF', '#65CADA00'] as const) : (['#FF5039FF', '#FF503900'] as const),
      },
      seasonTitleLeftToRight: {
        colors: (crews = false) =>
          crews ? (['#293B61FF', '#293B6100'] as const) : (['#610B2EFF', '#610B2E00'] as const),
      },
      seasonTitleRightToLeft: {
        colors: (crews = false) =>
          crews ? (['#3D399000', '#3D3990FF'] as const) : (['#BA1A2700', '#BA1A27FF'] as const),
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
