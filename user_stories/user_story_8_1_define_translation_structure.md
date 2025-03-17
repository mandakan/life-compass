---
title: 'Define Translation Structure'
type: 'user_story'
status: 'done'
priority: 'Must'
---

# Define Translation Structure

## 📌 Description

The application should have a structured way to store and manage translations for different languages. This includes methods to load translation files dynamically as well as strategies to support scalability (e.g., adding new languages or updating strings without breaking the UI).

## ✅ Acceptance Criteria

- A JSON-based or equivalent format is used to store language strings.
- The application dynamically loads the appropriate language file based on the user's selected language.
- Fallback mechanisms are in place if a particular translation or language file is missing.
- The structure is flexible enough to support future enhancements, such as context-based or component-scoped translations.
- Consideration is given to potential RTL language support.

## 🎯 Definition of Done

- Language files are organized in a designated directory with a clear naming pattern (e.g., en.json, sv.json).
- The dynamic loader is implemented to fetch and parse language files at runtime.
- Documentation and examples are provided to show how to add a new language or update existing translations.
- Automated tests ensure that missing translation keys fall back gracefully.
- Stakeholder review confirms the proposal meets both current and anticipated needs.

## ❓ Refinement Questions

- Should we adopt a library (e.g., i18next, react-intl) to handle translations, or implement a custom solution? Yes. i18next is the choice.
- How will we structure our JSON files: as flat key/value pairs or with nested objects to group related strings (e.g., for different components or pages)? Flat structure.
- What is the strategy for handling missing keys or incomplete translations in a user-friendly manner? Fallback to english for end-users. Developers should get a log message and the missing translations shall be collected. The debugging is not enabled in production.
- How could we support context-specific translations (different wording based on where the string is used)? Just add context variations in the json, do not use dynamic context switching.
- Do we require support for pluralization, gender, or other language-specific grammar rules? Yes.
- Will the translation files support versioning to manage changes over time, and how will we handle deprecations? As the translation files will be part of the same deployment as the app at all times no versioning should be necessary. Use version 1.0.0 in the json and check for this version when loading translations. No other versioning needed.
- Are there additional safety measures, such as schema validations, needed to ensure the integrity of translation files? Validate this during testing.
- For RTL languages, what additional layout or style adjustments must be envisioned? We will not support RTL at this point.
- How will translations be updated or deployed, considering continuous integration and delivery environments? As part of the app deployment, no separate translation deployments.
- How will strings be extracted for translation? Use i18next-parser and strings saved during debugging.

## 🔍 Additional Perspectives for Discussion

- Explore potential integration points with the UI framework to make translation switching seamless.
- Consider the developer experience: how easy is it to add or modify translations, and how can we prevent errors in translation files?
- Evaluate the possibility of using automated extraction tools to sync strings between the codebase and translation files.
- Discuss fallback strategies in international contexts: if a user’s language is not supported, should we default to English or another base language?
