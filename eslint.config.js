import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig, globalIgnores } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { configs } = js;

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: configs.recommended,
  allConfig: configs.all,
});

export default defineConfig([
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
      'react/prefer-read-only-props': 'warn',

      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-require-imports': ['error', { allow: ['\\.png$', '\\.otf$', '\\.ttf$'] }],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/require-await': 'off',

      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',

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
  globalIgnores(['dist/*', '**/*.js', '**/*.cjs']),
]);
