# Life Compass Code Conventions

This document outlines coding conventions to ensure consistency, maintainability, and clarity. These rules should be strictly followed when developing the project, including when using AI-assisted tools like Aider.

## General Coding Principles
- Follow the SOLID principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
- Follow DRY (Don't Repeat Yourself) and KISS (Keep It Simple, Stupid) principles.
- Use modular, reusable components to avoid redundant code.
- Use functional components in React with TypeScript.

## File and Folder Structure

```
life_compass/
│── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page-specific components
│   ├── utils/       # Helper functions and utilities
│   ├── hooks/       # Custom React hooks (if applicable)
│   ├── state/       # Zustand/Redux/Context API state management
│   ├── assets/      # Images, icons, styles
│   ├── tests/       # Unit and integration tests
```

- Keep business logic separate from UI components (no direct API calls inside components).
- Use named exports for all utility functions and services.

## Naming Conventions
- Functions and variables: camelCase (handleClick, fetchData)
- Components and classes: PascalCase (LifeCompassChart, RatingInput)
- Constants and enums: UPPER_CASE (DEFAULT_LANGUAGE, MAX_SCORE)
- File names: Use dash-separated lowercase (life-compass-chart.tsx)
- Tests: Use *.test.tsx or *.spec.tsx for test files

## TypeScript Conventions
- Always define types explicitly for components and functions.
- Use interfaces instead of types where possible.
- Example:
interface User {
  id: number;
  name: string;
}

## State Management Strategy
- Use lightweight state management (React Context API or Zustand).
- Persist data in Local Storage as structured JSON.
- Encapsulate state management in dedicated services (storageService.ts).

## Security and Privacy
- All user data remains in Local Storage (no backend storage).
- Warn users before overwriting or deleting data.
- Encrypt sensitive data before storing it.

## UI and UX Best Practices
- Mobile-first design with responsive scaling.
- Keep UI components consistent (use Tailwind CSS for styling).
- Follow WCAG 2.1 for accessibility (contrast, keyboard navigation, aria-labels).

## Styling & Tailwind CSS Conventions
- Use utility-first approach, avoid unnecessary custom CSS.
- Example:
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
  Click me
</button>


## Routing (React Router)
- Define routes in App.tsx, follow nested routing where needed.

## Performance and Optimization
- Minimize re-renders (use useMemo, useCallback when needed).
- Lazy load charts and reports to improve performance.
- Cache language files instead of loading them repeatedly.

## Testing Best Practices
- Write testable code.
- Write unit tests.

## AI-Assisted Development
- Any AI-generated code must strictly follow these conventions.
- If in doubt, ask before assuming structure.
