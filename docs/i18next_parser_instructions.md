# i18next Parser Instructions

This document explains the process for running the i18next parser to extract translation strings and merge new keys into the translation JSON files.

## Overview

The i18next-parser is configured to scan the source code for translation keys and update the translation files (located in `public/locales/[locale]/translation.json`) with any missing keys. This ensures that as new translation strings are added, the corresponding locale files are automatically updated.

## Prerequisites

- Node.js and npm must be installed.
- The i18next-parser package should be installed as a development dependency. If it is not installed, you can run:
  ```
  npm install --save-dev i18next-parser
  ```
- Make sure the configuration file `i18next-parser.config.js` is present in the project root.

## Running the Parser

There are two common ways to run the i18next parser:

### 1. Using npx
Use the following command in your terminal:
