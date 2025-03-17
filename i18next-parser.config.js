const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API key directly from the environment
});

async function translateToEnglish(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a professional Swedish-to-English translator. Translate concisely without changing meaning." },
        { role: "user", content: `Translate the following text to English: "${text}"` }
      ]
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return the original text if translation fails
  }
}

module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  indentation: 2,
  keepRemoved: false,
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
  defaultValue: (lng, ns, key) => (key), // Use Swedish text as the default in `sv.json`
  keySeparator: "_",
  keyAsDefaultValue: false,

};
