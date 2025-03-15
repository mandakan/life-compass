---
title: 'Create Life Compass'
type: 'user_story'
status: 'done'
priority: 'Must'
---

# Create Life Compass

## 📌 Description

The user should be able to create a life compass with customizable life areas. The implementation should allow the user to either choose from a set of predefined life areas or define their own custom areas. The process should be straightforward and intuitive, ensuring that first-time users can easily understand and use the feature.

## ✅ Acceptance Criteria

- The user can choose between predefined life areas or opt to create custom life areas.
- The created life compass is stored in Local Storage and persists between sessions.
- The interface guides the user through the creation process with clear instructions.
- The UI should accommodate error handling (e.g., if Local Storage is unavailable).
- The first MVP of the app shall be in Swedish but this will be configurable in a later user story.

## 🎯 Definition of Done

- The UX flow is designed, implemented, and tested for both predefined and custom life areas.
- Data persists reliably in Local Storage.
- Basic validations are in place for custom life area creation.
- Unit tests cover the core functionalities of life compass creation.
- The feature has been reviewed for responsiveness and accessibility.

## ❓ Refinement Questions

- What specific UI components or layout patterns should be used to guide the user through the life compass creation process? For the initial design I would like each life area to be represented by a card with a title, description and two numerical ratings (between 1-10). The cards shall be spread out in a circle (or the outer edges of a grid) on desktop devices but since this is a mobile first app adhere to design and UX best practices on smaller screens.
- How should the system handle scenarios where Local Storage is not available or fails? Inform the user and make sure they understand that nothing will be saved but let them continue with using the app. Maybe have a persistent warning banner visible in these cases?
- Are there any animations or transitions that are preferred or required during the onboarding of this feature? Use UX and design best practices to create a pleasant experience, ensuring the interaction remains distraction free since users may be experiencing stress or depression.
- What error messages or fallback behaviors should we implement in case of invalid input or storage errors? Start with a minimal set that prevents the user from losing work.
- Should we provide tooltips or additional help prompts for first-time users during the creation process? Yes.
- Are there any design constraints regarding the customization of life areas (e.g., maximum number of areas, character limits) that we should enforce? Not at this stage.
- Should users be allowed to edit, remove, or reorder life areas after initial creation? Clarify if post-creation modifications are permitted or if this will be handled in a separate user story. Modifications shall be permitted.
- How should duplicate life area names be handled? Should the system prevent duplicates or allow them with a warning? The system shall prevent duplicates. Use a guid/uuid as unique identifier for each area to avoid using the life area name as unique and primary key. This id shall not be visible to the user.
