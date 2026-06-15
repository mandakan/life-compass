# Life Compass

[![CI/CD](https://github.com/mandakan/life-compass/actions/workflows/ci_cd.yml/badge.svg?branch=main)](https://github.com/mandakan/life-compass/actions/workflows/ci_cd.yml)
[![Deploy](https://github.com/mandakan/life-compass/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/mandakan/life-compass/actions/workflows/deploy.yml)
[![Lint](https://github.com/mandakan/life-compass/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/mandakan/life-compass/actions/workflows/lint.yml)
[![Vulnerability Scan](https://github.com/mandakan/life-compass/actions/workflows/vuln-scan.yml/badge.svg?branch=main)](https://github.com/mandakan/life-compass/actions/workflows/vuln-scan.yml)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20the%20Project-orange)](https://www.buymeacoffee.com/thias)

Live App: [https://mandakan.github.io/life-compass/](https://mandakan.github.io/life-compass/)

This project aims to develop a web-based application that helps users reflect on their life balance through a tool called **Life Compass**. The application will allow users to identify and evaluate important life areas, set goals, and track their progress over time.

## AI-Assisted Development

This project is developed in collaboration with AI coding tools. A key aspect of the project is to **explore the potential of AI in software development** -- decision-making, architecture, and implementation. The project was bootstrapped with [Aider](https://aider.chat) and is now developed with [Claude Code](https://www.anthropic.com/claude-code) (Anthropic), with human direction and review.

### AI's Role in the Project

- **AI makes many decisions**: From technical choices to architecture and implementation details, AI-generated suggestions are often accepted.
- **Experimentation over perfection**: The project is not purely about producing the most optimized code, but about testing AI capabilities in real-world development.
- **Guided by conventions**: While AI is given freedom, structured conventions (see [CONVENTIONS.md](CONVENTIONS.md)) and a CI pipeline keep things coherent.

This means the code and structure reflect an evolving collaboration between human input and AI-generated development.

---

## 🧰 Tech Stack

- **UI**: React 19 + TypeScript, [Vite](https://vitejs.dev) 8
- **Styling**: Tailwind CSS 4 (CSS-first `@theme` tokens), self-hosted Fraunces + Hanken Grotesk fonts
- **State & persistence**: [Zustand](https://zustand-demo.pmnd.rs) with `persist` to `localStorage` (a single versioned document with schema migrations)
- **Components**: [Radix UI](https://www.radix-ui.com) primitives, [Heroicons](https://heroicons.com)
- **Charts**: [Recharts](https://recharts.org) (the balance-wheel / radar view)
- **i18n**: [i18next](https://www.i18next.com) / react-i18next
- **Tooling**: Vitest + Testing Library (unit), Playwright (E2E), ESLint, Prettier, Knip
- **Themes**: light, dark, and a WCAG-AAA high-contrast theme

The app is **local-first**: there is no backend, and all data stays in the user's browser.

---

## Life Compass - Concept and Methodology

The source and inspiration for this app is: https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-varderingar/

The Life Compass is a tool for **self-reflection and personal sustainability**. It helps users evaluate different aspects of their lives, identify imbalances, and create action plans for improvement.

### How the Life Compass Works

1. **Define Life Areas**  
   The user defines key life areas (e.g., Health, Career, Relationships, Personal Development).

2. **Set how much each area matters, and how you have lived it**  
   For each area you set how much it **matters** to you and how closely you have **lived by it this past week**. These are shown in plain words (e.g. _A little -> Deeply_ and _Far from it -> Fully_), not numbers -- there are no scores in the interface.

3. **Notice the gap, kindly**  
   The distance between what matters and how the week felt is surfaced gently -- never a score, never a streak. A larger gap is just a quiet signal of where your attention may want to go.

4. **Set Goals and Take Action**  
   You can attach goals and checkable action steps to any area; progress is derived from the steps you complete.

5. **Track Over Time**  
   Save a snapshot whenever you like; the **This week** view shows how each area has moved, with no pressure to keep a streak.

The same data is offered as four switchable perspectives -- a calm **Map** (you at the centre, with the things that matter around you), a plain **List**, a single-focus **Today**, and a reflective **This week** -- so you can engage however suits you.

### Why Use the Life Compass?

- Provides a **structured self-assessment** without requiring professional coaching.
- Helps identify **hidden stress factors** and areas of life needing more focus.
- Encourages **intentional goal setting** based on real priorities.
- Creates a **visual representation** of life balance for better understanding.

This methodology serves as the foundation for the Life Compass application, guiding the features and structure of this project.

---

## 📌 Epics and User Stories

- [Epics](epics/)
- [User Stories](user_stories/)

See each file for detailed information on requirements and implementation.

---

# 🚀 Roadmap & Development Phases

This roadmap outlines the different development phases of the Life Compass project. The app will be built iteratively, ensuring a structured approach to implementation.

## 🌟 Phase 1: Foundation & Technical Setup

> Goal: Establish a strong foundation for the project, ensuring clear technical principles and structure.

✅ **Technical Architecture & Code Structure**

- [x] User Story 6.1: Define Tech Stack and Frameworks
- [x] User Story 6.5: Use a Modular Code Structure

✅ **Data Management**

- [x] User Story 6.2: Implement Local Storage for Data Persistence
- [ ] User Story 6.3: Encrypt Sensitive Data in Local Storage (optional)

✅ **Development Environment & Tooling**

- [x] User Story 7.6: Integrate Testing in CI/CD Pipeline

## 🌟 Phase 2: Core Life Compass Functionality (MVP 1)

> Goal: Implement the fundamental features required to create and manage a Life Compass.

✅ **Core Features**

- [x] User Story 1.1: Create Life Compass
- [x] User Story 1.2: Customize Life Areas
- [x] User Story 1.3: Rate Life Areas
- [x] User Story 1.4: Visualize Life Compass
- [x] User Story 1.5: Save and Load Life Compass
- [x] User Story 1.6: Reset Life Compass

✅ **UI/UX**

- [x] User Story 5.1: Define Design Principles
- [x] User Story 5.2: Implement Mobile-First Layout

✅ **Deployment**

- [x] User Story 10.1: Automate deployment to GitHub Pages
- [x] User Story 10.2: Configure Vite for GitHub Pages

## 🌟 Phase 3: Enhanced Functionality & Additional Features

> Goal: Elevate the application with advanced features including improved navigation, onboarding, sorting, dark mode support, and robust export/import capabilities with appropriate warnings.

### UI Enhancements

- [x] User Story 5.4: Optimize Navigation and Usability
- [x] User Story 5.6: Dark Mode Support

### Additional Life Compass Features

- [x] User Story 1.7: Onboarding Tutorial (superseded by the first-run Welcome flow in the Your Compass redesign)
- [ ] User Story 2.2: Sort Life Areas by Gap

### Data Export/Import & Warnings

- [x] User Story 9.1: Export JSON
- [x] User Story 9.4: Import JSON
- [x] User Story 9.5: Warn on Overwrite (import shows a preview and confirmation)

## 🌟 Phase 4: Internationalization & Localization

> Goal: Ensure the Life Compass is accessible to a global audience by implementing robust internationalization (i18n) support and dynamic language features.

### Key Features & User Stories

- [x] User Story 8.1: Define Translation Structure
- [x] User Story 8.2: Implement Language Switcher
- [x] User Story 8.10: Crowdsourced Translation Review
- [x] User Story 8.11: Export/Import Translations
- [ ] User Story 8.5: Dynamic Language Loading
- [ ] User Story 8.6: Automatic Translation
- [ ] User Story 8.8: User Feedback on Translations

## 🌟 Phase 5: Automated Testing & Quality Assurance

> Goal: Establish robust testing frameworks and processes to ensure continuous stability and regression prevention through comprehensive automated tests.

✅ **Testing Automation**

- [x] User Story 7.10: Implement Automated End-to-End Tests

## 🌟 Phase 6: Goals & Action Planning (Epic 3)

> Goal: Turn imbalances into action -- let users set goals per life area and track them with checkable steps.

- [x] User Story 3.1: Set Goals for Life Areas
- [x] User Story 3.2: Track Goal Progress (derived from completed steps)
- [x] User Story 3.3: Define Action Steps for Goals
- [ ] User Story 3.4-3.7: Prioritization, deadlines, review-over-time, smart suggestions

## 🌟 Phase 7: Design System, Redesign & Accessibility

> Goal: A reusable design system and a polished, mobile-first, accessible UI.

- [x] Tokenized design system via Tailwind 4 `@theme` (color, type, spacing, radius, shadow, motion)
- [x] Three themes (light, dark, high-contrast) with verified WCAG contrast (AA, AAA on high-contrast)
- [x] Rebuilt, accessible UI primitives (visible focus, 44px touch targets, reduced-motion)
- [x] Mobile-first screen redesign (light sticky header, compass action bar, editorial pages)

---

## Currently Implemented Features

- Create and manage a Life Compass: add, edit, reorder, and remove life areas (with predefined sets per language).
- Rate each area's **importance** and **satisfaction**, with an at-a-glance **gap** indicator.
- Visualize the compass as a **radar chart** (importance vs. satisfaction).
- **Goals & action steps** per life area, with step-derived progress.
- **Snapshots**: save dated snapshots of the compass to revisit later.
- **Export/Import** to JSON, with import preview, validation, and confirmation.
- **Local-first persistence** via a single versioned document in `localStorage` (Zustand `persist`, with schema migrations).
- **Internationalization** (i18next) with an in-app language switcher.
- **Theming**: light, dark, and a WCAG-AAA high-contrast theme; optional follow-system.
- **Accessible, mobile-first UI** with an onboarding tour.
- **Automated tests**: unit (Vitest) and end-to-end (Playwright), run in CI.

---

## 🔧 Deployment Configuration for GitHub Pages

To deploy the Life Compass application on GitHub Pages without breaking routes or asset loading, the Vite configuration is set to use a dynamic base path. In production builds, the application uses the base path specified by the environment variable GH_PAGES_BASE. For example, if your repository is deployed under "/life-compass/", ensure that GH_PAGES_BASE is set accordingly before building the project. For local development the base path remains as '/'.

Instructions:

1. For local development, no additional configuration is needed.
2. For production build (GitHub Pages deployment), set the environment variable:

   On Linux/Mac:
   export GH_PAGES_BASE=/life-compass/

   On Windows (Command Prompt):
   set GH_PAGES_BASE=/life-compass/

3. Build the project:
   npm run build

4. Deploy the contents of the build folder to GitHub Pages.

---

## 🔧 Development Guidelines

The full coding conventions are in [CONVENTIONS.md](CONVENTIONS.md). The essentials:

- **Local-first**: all data stays in the browser's `localStorage`; there is no backend.
- **Single source of truth**: a Zustand store (`src/store/lifeCompassStore.ts`) holds the compass data and persists it as one versioned document. Don't write compass data to `localStorage` directly -- go through the store.
- **Separation of concerns**: keep business logic in `src/utils/` services and the store, not in UI components. Import with the path aliases (`@components`, `@utils`, `@models`, ...).
- **Styling**: Tailwind 4 utility-first, with design tokens defined as `@theme` variables in `src/index.css`.
- **Accessibility**: mobile-first, WCAG 2.1, with light, dark, and high-contrast themes.

### Planned, not yet implemented

A few privacy and hardening ideas are intended but not built yet:

- At-rest encryption of local data (User Story 6.3).
- Automatic backups before destructive actions (User Story 9.7).
- A Content Security Policy to restrict external scripts.

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## Resources

For more information about the concepts, tools, and methodologies used in this project, refer to the following resources:

### Life Compass and values (in Swedish)

- [KBT i Primärvården: Modul 4 - Värderingar](https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-varderingar/)  
  _The "Life Compass" is a therapeutic tool used in cognitive behavioral therapy to help patients identify and articulate their core life values across various domains, facilitating alignment of their actions with these values to enhance behavioral activation._

### Life Compass and Self-Reflection

- [Acceptance and Commitment Therapy for Stress Management](https://www.livskompass.se/wp-content/uploads/2012/11/Granberg_Westin_Psykologexamensuppsats_2012-1.pdf)  
  _A study on how the Life Compass is used as a tool for managing stress and promoting mental well-being among young people._

### AI-Assisted Development

- [Claude Code](https://www.anthropic.com/claude-code)  
  _Anthropic's agentic coding tool; the project's current AI development environment._
- [Aider: AI-Powered Code Collaboration](https://aider.chat/)  
  _The terminal-based AI pair-programming tool used to bootstrap the project._

### Open Source and Contribution Guidelines

- [MIT License Overview](https://opensource.org/licenses/MIT)  
  _Details about the MIT license used in this project._

- [How to Contribute to Open Source Projects](https://opensource.guide/how-to-contribute/)  
  _A guide to understanding how to contribute to open source projects._

These resources provide additional context and insights into the methodologies and technologies influencing this project.

---

## Support the Project

If you find this project useful, you can support it here:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20the%20Project-orange)](https://www.buymeacoffee.com/thias)
