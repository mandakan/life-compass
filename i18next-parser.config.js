module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: true,
  keySeparator: '.',
  lexers: {
    js: [
      'JavascriptLexer'
    ],
    ts: [
      'JavascriptLexer'
    ],
    default: [
      'JavascriptLexer'
    ]
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
  updateMissing: true
};
