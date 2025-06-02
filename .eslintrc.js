// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'plugin:react-native/all',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  ignorePatterns: ['/dist/*', '*.js'],
  plugins: ['react-native', 'react', '@typescript-eslint', 'simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: true,
  },
  rules: {
    'react-native/sort-styles': 'off',
    'react/jsx-sort-props': 'warn',
    'react/react-in-jsx-scope': 'off', // Not necessary after React 17
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/consistent-type-exports': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/require-await': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/no-restricted-paths': [
      'warn',
      {
        basePath: './src',
        zones: [
          {
            target: './!(__tests__)/**',
            from: './app/**',
            message: 'App routes must not be imported outside of tests',
          },
        ],
      },
    ],
  },
  root: true,
};
