import { StyleSheet } from 'react-native-unistyles';

const theme = {
  color: {
    accent: '#FEDD84',
    storeTitleShadow: '#2D2D2D80',
    itemImageBackground: '#512A8C',
    itemNameShadow: '#291A3183',
    itemNameBackground: '#664D9A',
    itemPriceBackground: '#4513A1',
    itemPriceBorder: '#9D6DEB',
    itemSelectedPrimary: '#FF9100',
    itemSelectedSecondary: '#FAC468',
    buttonSelectedPrimary: '#FF8E00',
    buttonSelectedSecondary: '#F4EBE2',
    currencyLabelShadow: '#00000049',
    statsContainerBorder: '#876AAA',
    statRowsBorder: '#8B6DAF',
    statRowsBackground: '#1F094C',
    statRowBackground: '#3E1399',
    leaderboardLabelOutline: '#0000008F',
    tabBackground: '#561FBC',
    tabInnerBackground: '#571CBA',
    tabLabelOutline: '#562E95FF',
    tabLabelShadow: '#1F074C7C',
    tabPressedBackground: '#FEF5EB',
    tabPressedLabelShadow: '#0000007C',
    tabSelectedBorder: '#A186C5FF',
    tabSelectedLabel: '#24094FFF',
    headerSeparator: '#A990CCFF',
    headerTitle: '#E7C8FFFF',
    overlay: '#000000AA',
    dialogBorderPrimary: '#A95AF1',
    dialogBorderSecondary: '#4C12AA',
    borderPrimary: '#28074B80',
    borderLight: '#CACEFF',
    dark: '#161616',
    weak: '#676767',
    inactive: '#84769C',
    disabled: '#AAAAAA',
    upcoming: '#664D9A',
    ongoing: '#FAC468',
    completed: '#FC7575',
    black: 'black',
    white: 'white',
    transparent: '#FFFFFF00',
    translucentBorder: '#00000059',
    error: '#BA1A27',
    // Currency colors
    coins: '#FFFFB4',
    bucks: '#0FDE6B',
    medals: '#B0F6D6',
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
        colors: ['#1D0F2E00', '#FF91F71F'],
      },
      headerShadow: {
        // Mod Kit - BarBGUnderGlowCurve with a tint
        colors: ['#FFFFFF40', '#1D1A3000'],
      },
      headerTitleBackground: {
        // Mod Kit - Font_PinkCurve with a tint
        colors: ['#00000099', '#00000000'],
        times: [0.8, 1],
      },
      labelText: (pressed?: boolean, light?: boolean) => ({
        // Mod Kit - Font_PinkCurve
        colors: pressed
          ? light
            ? (['#FFFFFF', '#FFFFFF'] as const)
            : (['#000000', '#000000'] as const)
          : (['#FFFFFF', '#E4C1FF'] as const),
      }),
      tabBorder: {
        // Mod Kit - StoreTabButtonCurve
        colors: ['#422C8FFF', '#8F60D0FF'],
        times: [0.193443, 0.468601],
      },
      alert: {
        // Mod Kit - GentleWhiteToGray
        colors: ['#FFFFFFFF', '#C4C4C4FF'],
      },
      storeGradient: {
        // Mod Kit - BGFadeAtlas with a tint
        colors: ['#172644FF', '#17264400'],
        times: [0.4, 1],
      },
      xpRotationalBonusBanner: {
        // Mod Kit - ButtonBannerCurve
        colors: ['#55C5FFFF', '#55C5FFFF', '#3877ADFF', '#3877ADFF'],
        times: [-0.023, 0, 1, 1.035],
      },
      xpRotationalBonusTimeLeft: {
        colors: ['#152233B3', '#152233B3', '#0E1E2CB3', '#0E1E2CB3'],
        times: [-0.023, 0, 1, 1.035],
      },
      leaderboardLeftGradient: {
        colors: ['#00000000', '#00000080'],
      },
      leaderboardRightGradient: {
        colors: ['#00000080', '#00000000'],
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
    xxl: 32,
  },
  font: {
    primary: {
      regular: 'FranklinGothicDemiCond-Regular',
      italic: 'FranklinGothicDemiCond-Italic',
    },
    secondary: {
      bold: 'AgencyFB-Bold',
      boldWide: 'AgencyFB-BoldWide',
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
