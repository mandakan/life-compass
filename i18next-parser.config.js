module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: true,
  keySeparator: '.',
  lexers: {
    js: ["JavascriptLexer"],
    jsx: ["JsxLexer"],  // Add JSX support
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],  // Add TSX support
    default: ["JavascriptLexer"],
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
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  defaultValue: (lng, ns, key) => key, // Keep Swedish as default
  keyAsDefaultValue: false, // Prevent Swedish from becoming keys
  transformKey: async (key, defaultValue) => {
    if (!defaultValue) return key; // Skip if no default value
    
    const translatedKey = await translateToEnglish(defaultValue);
    return translatedKey.replace(/\s+/g, "_").toLowerCase();
  }
};
