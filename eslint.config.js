const { FlatCompat } = require('@eslint/eslintrc');
const withCompat = new FlatCompat();

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  ...withCompat.config(require('eslint-plugin-react').configs.recommended),
  ...withCompat.config(require('eslint-plugin-react-hooks').configs.recommended),
];