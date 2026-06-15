# Life Compass Code Conventions

This document outlines coding conventions to keep the project consistent, maintainable, and clear. Follow these when developing, including with AI-assisted tools. The project was bootstrapped with Aider and is now developed with Claude Code.

## General Coding Principles

- Follow SOLID, DRY, and KISS. Favor composition over inheritance.
- Use modular, reusable components.
- Use functional React components with TypeScript.
- Keep business logic out of UI components; put it in `src/utils/` services and the store.

## File and Folder Structure

```
src/
  components/   # Reusable UI components (ui/ holds design-system primitives;
                # your-compass/ holds the four compass views; goals/, guide/)
  pages/        # Route-level components (one per screen)
  store/        # Zustand store -- single source of truth + persistence
  context/      # React Context providers (theme, app settings)
  hooks/        # Custom React hooks
  utils/        # Helper functions and services (export/import, model, theme)
  types/        # Shared TypeScript types (aliased as @models)
  schemas/      # JSON schemas (import/export validation)
  data/         # Predefined life areas per language
  lib/          # Small shared helpers (i18n re-export, class utils)
  tests/        # Unit and integration tests (*.test.tsx / *.spec.tsx)
```

- Use named exports for utility functions and services.
- Import via the path aliases (`@components/*`, `@utils/*`, `@pages/*`, `@context/*`, `@models/*`, `@tests/*`, `@/*`) rather than long relative paths.

## Naming Conventions

- Functions and variables: camelCase (`handleClick`, `fetchData`)
- Components: PascalCase (`MapView`, `ScaleChooser`)
- Constants: UPPER_CASE (`STORE_KEY`, `PERSIST_VERSION`)
- File names: dash-separated lowercase for non-component files; PascalCase for components
- Tests: `*.test.tsx` or `*.spec.tsx`, kept in `src/tests/`

## TypeScript Conventions

- Define types explicitly for component props and function signatures.
- Prefer `interface` for object shapes.
- Strict mode is on; keep it clean (no implicit `any`).

## State Management and Persistence

- The Zustand store in `src/store/lifeCompassStore.ts` is the single source of truth for compass data (`lifeAreas`, `history`, `goals`). Read and write through it.
- Persistence uses Zustand's `persist` middleware to a single versioned document in `localStorage` (key `life-compass`). Do not write compass data to `localStorage` directly.
- `src/utils/storageService.ts` handles only non-document flags (e.g. the onboarding `tutorialCompleted` flag).
- When the persisted shape changes, bump `PERSIST_VERSION` and add a branch to the store's `migrate` hook. The exported/imported document shape is versioned separately by `CURRENT_SCHEMA_VERSION` in `src/types/LifeCompassDocument.ts`.
- Ratings are stored as 1-10 integers but shown as 1-5 word buckets. Convert with the helpers in `src/utils/compassModel.ts` instead of reading raw values.

## Privacy

- All user data stays in the browser; there is no backend.
- Warn users before overwriting or deleting data (import shows a preview and confirmation).
- At-rest encryption of local data is not implemented; see the roadmap in `README.md`.

## UI and UX

- Mobile-first, responsive design.
- Keep components consistent; style with Tailwind CSS.
- Follow WCAG 2.1 (contrast, keyboard navigation, aria labels). The app ships light, dark, and a WCAG-AAA high-contrast theme.

## Styling and Tailwind

- Utility-first; avoid unnecessary custom CSS.
- Design tokens are defined as Tailwind 4 `@theme` variables in `src/index.css`. Use the token-backed utilities (e.g. `bg-bg`, `text-text`) for consistency rather than ad-hoc colors.

## Routing

- Routes are defined in `src/App.tsx` (React Router). The router uses `import.meta.env.BASE_URL` as its basename so it works under the GitHub Pages base path.

## Internationalization

- Strings go through i18next/react-i18next. Translation files load at runtime from `public/locales/<lng>/translation.json`.
- After adding or changing UI strings, run `npm run extract` to update translation keys.

## Performance

- Minimize re-renders (`useMemo`/`useCallback` where it helps).
- Keep the initial render light.

## Testing

- Write testable code and unit tests (Vitest + Testing Library). End-to-end flows are covered by Playwright in `e2e/`.

## AI-Assisted Development

- AI-generated code must follow these conventions.
- If the structure is unclear, ask before assuming.
