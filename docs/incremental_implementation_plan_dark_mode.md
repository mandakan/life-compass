# Incremental Implementation Plan: Dark Mode Support

This plan outlines step-by-step tasks to implement dark mode support as defined in User Story 5.6, ensuring that dark mode is fully integrated with system preference detection, manual toggling, and dynamic theme switching. Each phase describes the required work, dependencies, and verification steps.

## Phase 1: Research & Preparation
- Review current design tokens in src/designTokens.ts and CONVENTIONS.md.
- Confirm requirements for a complete overhaul of the UI styles for dark mode compared to the current light theme.
- Verify accessibility contrast guidelines and determine necessary CSS variable strategy (e.g., --color-bg, --color-text).
- Finalize how Tailwind CSS will reference CSS variables (update tailwind.config.js if necessary).
- Identify impacted UI components that require theme-specific styles and adjustments.

## Impacted UI Components
- Callout (src/components/Callout.tsx)
- CustomSlider (src/components/CustomSlider.tsx)
- LifeAreaCard (src/components/LifeAreaCard.tsx)
- MobileNavigation (src/components/MobileNavigation.tsx)
- RadarChart (src/components/RadarChart.tsx)
- WarningModal (src/components/WarningModal.tsx)
- Pages with inline styles and theme adjustments (e.g., CreateLifeCompass and DesignPrinciplesDemo)

## Phase 2: Establish Theme Token Infrastructure
- Create CSS variables for colors, backgrounds, and text in the global stylesheet (src/index.css).
- Set up default (light) theme variables at the :root level.
- Define dark theme overrides using attribute selectors (e.g., [data-theme="dark"]).
- Update Tailwind CSS configuration to reference these CSS variables for dynamic theming.

## Phase 3: Dark Mode Core Functionality
- Implement a JavaScript function to set and update the "data-theme" attribute on the document element (document.documentElement.setAttribute("data-theme", theme)).
- Enhance ThemeContext (src/context/ThemeContext.tsx) to:
    - Detect system preferred theme using matchMedia.
    - Listen for real-time changes to the system theme and trigger updates accordingly.
    - Allow manual override with an option to follow system settings, persisting the user's choice in local storage.
- Expose a theme toggle option through the settings menu.

## Phase 4: Update UI Components and Styles
- Update all UI components to use Tailwind CSS utility classes referencing CSS variables (e.g., bg-bg, text-text) instead of hardcoded colors.
- Refactor any components that use static color values, ensuring they adapt to the active theme.
- Ensure that dark mode styling aligns with our design principles and meets accessibility contrast standards.

## Phase 5: Testing and Verification
- Write unit tests for the theme toggle logic and ThemeContext functionality.
- Implement integration tests to verify:
    - The correct application of dark theme styles.
    - Real-time responsiveness when the system theme changes.
    - Persistence of user theme preferences across sessions via local storage.
- Conduct manual testing to ensure all UI components render correctly under both light and dark themes.

## Phase 6: Documentation and Code Review
- Update project documentation (e.g., design_principles.md, README.md) with details on dark mode implementation.
- Perform a thorough code review to confirm adherence to design tokens, Tailwind CSS conventions, and accessibility standards.

## Phase 7: Iteration and Enhancement
- Monitor user feedback after deployment.
- Adjust CSS variables or theme logic based on accessibility audits and user experience.
- Plan future enhancements for additional high-contrast themes if necessary.
