const { defineConfig, globalIgnores } = require('eslint/config');

const reactNative = require('eslint-plugin-react-native');
const react = require('eslint-plugin-react');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    extends: compat.extends(
      'expo',
      'plugin:react-native/all',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
    ),

    plugins: {
      'react-native': reactNative,
      react,
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      'react-native/sort-styles': 'off',
      'react/jsx-sort-props': 'warn',
      'react/react-in-jsx-scope': 'off',
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
  },
  globalIgnores(['dist/*', '**/*.js']),
]);
