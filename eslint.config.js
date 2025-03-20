const { flatCompat } = require('@eslint/eslintrc');
const withCompat = flatCompat();

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {}
  },
  withCompat(require("eslint-plugin-react").configs.recommended),
  withCompat(require("eslint-plugin-react-hooks").configs.recommended)
];
