let theme;

module.exports = {
  UnistylesRuntime: {
    getTheme: () => theme,
  },
  useUnistyles: () => {
    return {
      theme,
    };
  },

  StyleSheet: {
    configure: (config) => {
      theme = config.themes.default;
    },

    create: (styles) => {
      if (typeof styles === 'function') {
        return { ...styles(theme), useVariants: () => {} };
      }

      return styles;
    },
  },
};
