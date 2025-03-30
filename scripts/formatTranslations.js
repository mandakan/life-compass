const fs = require('fs');
const path = require('path');
const flat = require('flat');
const sortKeysRecursive = require('sort-keys-recursive');

// Sökvägen till dina språkfiler (ex: public/locales/sv/translation.json)
const localesDir = path.join(__dirname, '..', 'public', 'locales');

function processTranslationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Preprocessa de platta nycklarna:
    // Om en nyckel inte innehåller en punkt men det finns andra nycklar med samma prefix
    // flytta värdet under en undernyckel "default".
    const newData = {};
    const keys = Object.keys(data);
    for (const key of keys) {
      if (!key.includes('.')) {
        const hasNested = keys.some(otherKey => otherKey.startsWith(key + '.'));
        if (hasNested) {
          newData[`${key}.default`] = data[key];
        } else {
          newData[key] = data[key];
        }
      } else {
        newData[key] = data[key];
      }
    }
    
    // Omvandla platta nycklar till en hierarkisk struktur
    const unflattened = flat.unflatten(newData, { delimiter: '.' });
    
    // Sortera nycklarna rekursivt
    const sorted = sortKeysRecursive(unflattened);
    
    // Skriv tillbaka filen med 2 spaces indentation
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2));
    console.log(`Processed ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function processAllLocales() {
  try {
    const localeDirs = fs.readdirSync(localesDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
    localeDirs.forEach(localeDir => {
      const translationPath = path.join(localesDir, localeDir.name, 'translation.json');
      if (fs.existsSync(translationPath)) {
        processTranslationFile(translationPath);
      } else {
        console.warn(`No translation.json found in ${localeDir.name}`);
      }
    });
  } catch (error) {
    console.error('Error reading locales directory:', error);
  }
}

processAllLocales();