import ts from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import chaiFriendly from 'eslint-plugin-chai-friendly';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // TypeScript recommended rules (flat config)
  ...ts.configs.recommended,

  // Main config for source files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': ts.plugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React + Hooks
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Remove unused imports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'off',

      // Use TS-aware version for unused vars
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // TS + React cleanup
      'react/prop-types': 'off',
    },
  },

  // ✅ Special config for test files to support Chai assertions
  {
    files: ['**/*.test.*', '**/*.spec.*'],
    plugins: {
      'chai-friendly': chaiFriendly,
    },
    rules: {
      // Disable regular no-unused-expressions rules
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // Enable chai-friendly version
      'chai-friendly/no-unused-expressions': 'error',
    },
  },
];