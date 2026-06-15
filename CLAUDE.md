# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Life Compass is a local-first, single-page React app for self-reflection on life balance. There is **no backend**: all user data lives in the browser's `localStorage`. The app is deployed to GitHub Pages. See `README.md` for the product/methodology background and `CONVENTIONS.md` for coding conventions (note: parts of `CONVENTIONS.md` predate the current code -- e.g. it references `src/designTokens.ts`, which no longer exists; design tokens now live as Tailwind 4 `@theme` in `src/index.css`).

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # production build (type-checks via Vite/tsconfig)
npm test               # Vitest (watch). Unit tests only; e2e is excluded.
npm run test-verbose   # vitest --run --reporter verbose (one-shot)
npm run test:e2e       # builds, then runs Playwright e2e
npm run lint           # eslint over src
npm run format         # prettier --write .
npm run extract        # i18next-parser: pull translation keys from source
npm run check:knip     # unused files/exports/deps
npm run check:ts-prune # unused exports
```

Run a single unit test: `npx vitest run src/tests/compassModel.test.ts` (or `npx vitest -t "name"` to filter by test name). Node 22 is required (`.nvmrc`).

## Architecture

**State & persistence (the core).** A single Zustand store, `src/store/lifeCompassStore.ts`, is the source of truth. It holds `lifeAreas`, `history` (snapshots), and `goals`, and persists them to `localStorage` under the key `life-compass` via Zustand's `persist` middleware. Components read/write through this store -- do not touch `localStorage` directly for compass data.

There are **two independent version numbers**, don't conflate them:
- `PERSIST_VERSION` in the store -- bump when the persisted shape changes, and add a branch to the `migrate` hook. `onRehydrateStorage` also seeds from the legacy bare-array key (`lifeCompass`) for existing users, then clears it.
- `CURRENT_SCHEMA_VERSION` in `src/types/LifeCompassDocument.ts` -- the schema version stamped into exported/imported JSON documents.

**Data model** (`src/types/`): `LifeArea` (name, description, details, `importance`, `satisfaction`). `Goal` is a **top-level array keyed by `areaId`**, not nested inside `LifeArea`; removing an area cascade-deletes its goals. Goal progress is always **derived** from completed `ActionStep`s, never stored. A `Snapshot` denormalizes area name + ratings so history stays truthful after renames/deletes.

**Scale adapter (important gotcha).** The store keeps ratings as **1-10 integers**, but the UI speaks **1-5 word buckets**. Conversion lives in `src/utils/compassModel.ts` (`toBucket`/`fromBucket`, plus `matters`/`lived`/`drift`). Use these helpers rather than reading raw `importance`/`satisfaction` in views.

**Routing & shell** (`src/App.tsx`): React Router with `basename={import.meta.env.BASE_URL}`. The `/welcome` first-run flow is "immersive" -- the standard `Navigation`/`Footer` are hidden on it. Providers wrap the app in this order: `ThemeProvider` (light/dark/high-contrast WCAG-AAA) -> `AppSettingsProvider` -> `Router`.

**Views** (`src/components/your-compass/`): the same store data is rendered as four switchable perspectives -- `MapView` (radar/balance wheel via Recharts), `ListView`, `TodayView`, `WeekView` -- coordinated by `PerspectiveSwitcher` and the `YourCompass` page.

**Services** (`src/utils/`): `exportService`/`importService` (JSON export/import; import is validated against `src/schemas/exportImportSchema.json` with Ajv and shown as a preview before confirm), `lifeAreaService`, `goalProgress`, `storageService` (only for non-document flags like the onboarding `tutorialCompleted` key), `themeUtils`.

**i18n** (`src/i18n.ts`): i18next + react-i18next with HTTP backend loading from `public/locales/{lng}/translation.json` at runtime (not bundled). Translation files are gated on a `version: "1.0.0"` field -- a mismatch logs a warning and falls back to English. Supported langs are listed in `i18n.ts`; predefined life areas per language live in `src/data/predefinedLifeAreas.<lng>.json`. After adding UI strings, run `npm run extract`.

## Conventions specific to this repo

- **Path aliases** (tsconfig + `vite-tsconfig-paths`): `@components/*`, `@context/*`, `@utils/*`, `@pages/*`, `@models/*` (-> `src/types`), `@tests/*`, `@/*` (-> `src/`). Prefer these over deep relative imports.
- **File names**: dash-separated lowercase for most files; components are `PascalCase`. Tests are `*.test.tsx`/`*.spec.tsx` and live in `src/tests/`. Prettier config: single quotes, semicolons, trailing commas, `arrowParens: avoid`, 80 cols.
- **Styling**: Tailwind 4 utility-first, tokens via `@theme` in `src/index.css`. Avoid custom CSS.
- **GitHub Pages base path**: production builds read `GH_PAGES_BASE` (defaults to `/life-compass`); dev uses `/`. Don't hardcode absolute asset/route paths.
- Entry for build/knip is `src/index.tsx`.
