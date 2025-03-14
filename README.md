# Life Compass

This project aims to develop a web-based application that helps users reflect on their life balance through a tool called **Life Compass**. The application will allow users to identify and evaluate important life areas, set goals, and track their progress over time.

## AI-Assisted Development

This project is being developed in collaboration with AI-assisted tools. A key aspect of this project is to **explore the potential of AI in software development**, including decision-making, structuring, and implementation.

### AI's Role in the Project

- **AI will make many decisions**: From technical choices to architecture and implementation details, AI-generated suggestions will often be accepted.
- **Experimentation over perfection**: The project is not purely about producing the most optimized code, but about testing AI capabilities in real-world development.
- **Guided by conventions**: While AI is given freedom, structured conventions are in place to maintain coherence.

This means that the code and structure **may not always follow traditional best practices** but instead reflect an evolving collaboration between human input and AI-generated development.

---

## Life Compass - Concept and Methodology

The Life Compass is a tool for **self-reflection and personal sustainability**. It helps users evaluate different aspects of their lives, identify imbalances, and create action plans for improvement.

### How the Life Compass Works

1. **Define Life Areas**  
   The user defines key life areas (e.g., Health, Career, Relationships, Personal Development).

2. **Rate Importance and Satisfaction**  
   Each life area is rated on a scale from **1 to 10** for:

   - **Importance**: How important is this aspect of life?
   - **Satisfaction**: How satisfied is the user with their current situation?

3. **Analyze Gaps and Prioritize**  
   The difference between **importance and satisfaction** reveals areas of imbalance.

   - Large gaps indicate areas that may need more attention.
   - Small gaps suggest a balanced or fulfilled aspect of life.

4. **Set Goals and Take Action**  
   The user creates goals and action steps to improve specific life areas.

   - Goals should be clear, actionable, and measurable.

5. **Track Progress Over Time**  
   Regular check-ins help the user track improvements and adjust their strategies.

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

- [ ] User Story 7.6: Integrate Testing in CI/CD Pipeline

## 🌟 Phase 2: Core Life Compass Functionality (MVP 1)

> Goal: Implement the fundamental features required to create and manage a Life Compass.

✅ **Core Features**

- [ ] User Story 1.1: Create Life Compass
- [ ] User Story 1.2: Customize Life Areas
- [ ] User Story 1.3: Rate Life Areas
- [ ] User Story 1.4: Visualize Life Compass

✅ **UI/UX**

- [ ] User Story 5.1: Define Design Principles
- [ ] User Story 5.2: Implement Mobile-First Layout

✅ **Basic Navigation & State Handling**

- [ ] User Story 5.4: Optimize Navigation and Usability

## 🌟 Phase 3–5 (See previous roadmap for details)

---

# 🔧 Development Guidelines

To ensure maintainability and efficiency while using AI-assisted tools like Aider, follow these **core principles**:

## 🏗️ **Architecture & Code Structure**

✅ **Follow SOLID Principles**

- **Single Responsibility Principle (SRP)**: Each component or module should have only **one reason to change**.
- **Open-Closed Principle (OCP)**: Code should be **extendable** without modifying existing logic.
- **Liskov Substitution Principle (LSP)**: Avoid deep class inheritance—favor composition over inheritance.
- **Interface Segregation Principle (ISP)**: Avoid "fat interfaces"; use smaller, more specific interfaces.
- **Dependency Inversion Principle (DIP)**: Rely on **abstractions rather than concrete implementations**.

✅ **Modular Design**

- **Component-based architecture**: UI elements should be reusable across different views.
- **Separation of Concerns (SoC)**: Keep **business logic separate** from UI and state management.

✅ **File & Folder Structure**

```
life_compass/
│── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page-specific components
│   ├── utils/       # Helper functions & utilities
│   ├── hooks/       # Custom React hooks (if applicable)
│   ├── state/       # Zustand/Redux/Context API state management
│   ├── assets/      # Images, icons, styles
│   ├── tests/       # Unit & integration tests
```

✅ **Naming Conventions**

- **Functions & Variables**: Use `camelCase` (`handleClick`, `fetchData`).
- **Components**: Use `PascalCase` (`LifeCompassChart`, `RatingInput`).
- **Constants & Enums**: Use `UPPER_CASE` (`DEFAULT_LANGUAGE`, `MAX_SCORE`).

## 🏗️ **State Management Strategy**

✅ **Use Local Storage for persistence**

- Store structured JSON objects, not raw strings.
- Avoid excessive writes to prevent performance issues.

✅ **Favor lightweight state management**

- Use **React Context API, Zustand, or similar** instead of complex global stores (Redux).
- Minimize re-renders by structuring state updates efficiently.

✅ **Data Flow & API Abstraction**

- Encapsulate Local Storage interactions within utility functions (`storageService.ts`).
- Prepare for potential backend integration by **abstracting data handling**.

## 🔐 **Security & Privacy Guidelines**

✅ **Ensure user data privacy**

- No backend means **all data is stored locally**—users must have control over their data.
- Encrypt sensitive user data (e.g., goals, personal reflections) **before storing** it in Local Storage.

✅ **Warn users before deleting or overwriting data**

- Show a confirmation dialog before **overwriting imported data**.
- Implement **automatic backups before major actions** (see User Story 9.7).

✅ **Implement Content Security Policy (CSP)**

- Restrict external scripts to prevent XSS attacks.
- Validate imported JSON files before applying changes.

## 🚀 **Performance & Optimization**

✅ **Minimize render blocking operations**

- Use **lazy loading** for charts, reports, and heavy components.
- Keep the **initial render lightweight**—defer loading non-essential data.

✅ **Optimize for Mobile Performance**

- **Avoid heavy animations**—prefer CSS transitions over JS-based motion libraries.
- **Reduce reflows and repaints**—structure UI elements efficiently.

✅ **Cache & Optimize Language Loading**

- **Load only the active language file** instead of bundling all translations at once.
- **Use caching** to minimize redundant translation requests (see User Story 8.7).

---

📌 **Next Steps:** Pick a phase and start implementing the listed user stories. Happy coding! 🚀

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## Resources

For more information about the concepts, tools, and methodologies used in this project, refer to the following resources:

### Life Compass and Self-Reflection

- [Acceptance and Commitment Therapy for Stress Management](https://www.livskompass.se/wp-content/uploads/2012/11/Granberg_Westin_Psykologexamensuppsats_2012-1.pdf)  
  _A study on how the Life Compass is used as a tool for managing stress and promoting mental well-being among young people._

### AI-Assisted Development and Aider

- [Aider: AI-Powered Code Collaboration](https://aider.chat/)  
  _Aider is an AI-driven tool for pair programming directly in the terminal, integrated with your local Git repository._

### Open Source and Contribution Guidelines

- [MIT License Overview](https://opensource.org/licenses/MIT)  
  _Details about the MIT license used in this project._

- [How to Contribute to Open Source Projects](https://opensource.guide/how-to-contribute/)  
  _A guide to understanding how to contribute to open source projects._

These resources provide additional context and insights into the methodologies and technologies influencing this project.
