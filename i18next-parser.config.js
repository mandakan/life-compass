module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  indentation: 2,
  keepRemoved: true,
  keySeparator: '.',
  lexers: {
    js: ["JavascriptLexer"],
    jsx: ["JsxLexer"],  // Add JSX support
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],  // Add TSX support
    default: ["JavascriptLexer"]
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
  defaultValue: (lng, ns, key) => key,
  keyAsDefaultValue: false,
  transformKey: async (key, defaultValue) => {
    if (!defaultValue) return key;
    const translatedKey = await translateToEnglish(defaultValue);
    return translatedKey.replace(/\s+/g, "_").toLowerCase();
  }
};

async function translateToEnglish(defaultValue) {
  // Dummy translation function. In a real scenario, integrate with a translation API.
  return defaultValue;
}
