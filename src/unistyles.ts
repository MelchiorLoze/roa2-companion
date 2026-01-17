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
    headerBackground: '#05011A',
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
      headerOverlay: {
        // Mod Kit - BarBGUnderGlowCurve with a tint
        colors: ['#130F2C00', '#AB91E833'],
      },
      button: (pressed?: boolean) => ({
        // Mod Kit - RectangleButtonCurve and RectangleButtonHighlightCurve with a tint of #FFFCF3FF
        colors: pressed ? (['#F1A645', '#FDD76A'] as const) : (['#2D1E78', '#5B75D0'] as const),
        times: pressed ? ([0, 1] as const) : ([0.006, 1] as const),
      }),
      arrowButton: (pressed?: boolean) => ({
        colors: pressed ? (['#EBA245', '#FFDB74'] as const) : (['#0D071D', '#161049'] as const),
      }),
      card: (pressed?: boolean) => ({
        // Mod Kit - NormalInnerCurve and NormalBorder
        colors: pressed ? (['#FFDB74', '#EBA245'] as const) : (['#161049', '#0D071D'] as const),
      }),
      border: (pressed?: boolean) => ({
        // Mod Kit - HoverBorder and NormalBorder
        colors: pressed ? (['#EBA245', '#FFDB74'] as const) : (['#CACEFF', '#6B76DB'] as const),
      }),
      tab: {
        // Mod Kit - NavBarCurve with 90% opacity
        colors: ['#302281E6', '#261365E6'],
      },
      tabSelectedOverlay: {
        // Mod Kit - NavBarButtonOpenCurve
        colors: ['#D9D9D900', '#FAD1684D'],
      },
      tabSelectedGoldAccent: {
        // Mod Kit - NavBarButtonOpenAccentCurve
        colors: ['#D9D9D900', '#FFDB8EB3', '#FFDB8EB3', '#D9D9D900'],
        times: [0, 0.3, 0.7, 1],
      },
      tabSelectedWhiteAccent: {
        // Mod Kit - NavBarButtonOpenAccentWhiteCurve
        colors: ['#D9D9D900', '#FFFFFFB3', '#FFFFFFB3', '#D9D9D900'],
        times: [0, 0.3, 0.7, 1],
      },
      alert: {
        // Mod Kit - GentleWhiteToGray
        colors: ['#FFFFFFFF', '#C4C4C4FF'],
      },
      store: {
        // Mod Kit - StoreBgCurve with 75% opacity
        colors: ['#4F38D4BF', '#251A5EBF'],
      },
      storeCountdown: {
        // Mod Kit - TimerBGCurve
        colors: ['#00000000', '#000000FF'],
        times: [0, 0.6],
      },
      statSection: {
        // Mod Kit - LeaderboardBgCurve
        colors: ['#3960B0B3', '#63A5ECB3', '#63A5ECB3', '#385E8633', '#385E8600'],
        times: [-0.025, 0.027, 0.207, 0.78, 1.093],
      },
      statRow: {
        // Mod Kit - EntryNumberBgCurve
        colors: ['#191256', '#1F176A'],
      },
      statRowOverlay: {
        // Mod Kit - EntryFadeCurve
        colors: ['#1C156100', '#3420ABFF'],
      },
      statPositionOverlay: {
        // Mod Kit - EntryFadeCurve with 51% opacity
        colors: ['#1C156100', '#3420AB83'],
      },
      statRankOverlay: {
        // Mod Kit - MI_RankedLeaderboardEntryFadeLeft with a black tint
        colors: ['#000000FF', '#00000000'],
        times: [-0.693334, 0.306666],
      },
      seasonTitleWrapper: (crews = false) => ({
        // Mod Kit - FadeCurve with a tint
        colors: crews ? (['#65CADAFF', '#65CADA00'] as const) : (['#FF5039FF', '#FF503900'] as const),
        times: [0, 0.8] as const, // estimated ~80% width
      }),
      seasonTitleLeftToRight: (crews = false) => ({
        // Mod Kit - FadeCurve with a tint
        colors: crews ? (['#293B61FF', '#293B6100'] as const) : (['#610B2EFF', '#610B2E00'] as const),
      }),
      seasonTitleRightToLeft: (crews = false) => ({
        // Mod Kit - FadeCurve with a tint
        colors: crews ? (['#3D399000', '#3D3990FF'] as const) : (['#BA1A2700', '#BA1A27FF'] as const),
      }),
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
