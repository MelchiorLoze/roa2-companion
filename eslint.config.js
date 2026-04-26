import js from '@eslint/js';
import { resolveFlatConfig } from '@leancodepl/resolve-eslint-flat-config';
import reactNativeConfig from '@react-native/eslint-config/flat';
import tsParser from '@typescript-eslint/parser';
import expoConfig from 'eslint-config-expo/flat.js';
import jest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import unistyles from 'eslint-plugin-react-native-unistyles';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import typescript from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = defineConfig([
  // Global ignores - must be first
  {
    ignores: ['dist/*', '**/*.js', '**/*.cjs', '**/*.snap', 'node_modules/*', 'android/*', 'ios/*'],
  },

  // Base configs
  js.configs.recommended,

  // TypeScript configs
  ...typescript.configs.recommendedTypeChecked,
  ...typescript.configs.stylisticTypeChecked,

  // React configs
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  // React Compiler config
  reactCompiler.configs.recommended,

  // React Native unistyles config
  ...unistyles.configs.recommended,

  // React Native config
  ...reactNativeConfig,

  // Expo config
  ...expoConfig,

  // Main configuration
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      // React Native
      'react-native/sort-styles': 'off',
      'react-native/no-unused-styles': 'warn',

      // React
      'react/jsx-sort-props': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prefer-read-only-props': 'warn',

      // TypeScript
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-require-imports': ['error', { allow: ['\\.png$', '\\.otf$', '\\.ttf$'] }],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
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
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

      'no-void': 'off',

      // Import sorting
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',

      // Import restrictions
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

  // Test file specific configuration
  {
    files: ['**/*.test.*', '**/__tests__/**'],
    plugins: { jest },
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
]);

export default resolveFlatConfig(config);
