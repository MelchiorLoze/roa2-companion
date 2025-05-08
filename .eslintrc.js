// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:react-native/all', 'plugin:react/recommended'],
  ignorePatterns: ['/dist/*'],
  plugins: ['simple-import-sort', 'react-native', 'react'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not necessary after React 17
    'react-native/sort-styles': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'react/jsx-sort-props': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};
