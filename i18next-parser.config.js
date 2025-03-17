module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  indentation: 2,
  keepRemoved: false,
  keySeparator: '.',
  lexers: {
    js: ['JavascriptLexer'],
    jsx: ['JsxLexer'], // Add JSX support
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'], // Add TSX support
    default: ['JavascriptLexer'],
  },
  lineEnding: 'auto',
  locales: ['en', 'sv'],
  namespaceSeparator: ':',
  output: 'public/locales/$LOCALE/translation.json',
  skipDefaultValues: false,
  sort: true,
  verbose: true,
  failOnWarnings: false,
  debug: true,
  updateMissing: true,
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  defaultValue: (lng, ns, key) => key, // Use Swedish text as the default in `sv.json`
  keySeparator: '_',
  keyAsDefaultValue: false,
};
