---
title: 'Customize Life Areas'
type: 'user_story'
status: 'draft'
priority: 'Must'
---

# Customize Life Areas

## 📌 Description

The user should be able to rename, add, remove, and reorder life areas in order to personalize their life compass. Users should have a flexible interface that allows them to modify the predefined set of life areas, as well as add new custom ones if they wish.

## ✅ Acceptance Criteria

- Users can rename existing predefined life areas.
- Users can remove predefined life areas.
- Users can add custom life areas.
- Users can reorder life areas via a drag-and-drop interface (if implemented, ensure it works across devices).
- The interface provides visual feedback when changes are made.
- Confirmation dialogs are shown for destructive actions (e.g., deletion).
- Changes are persisted in Local Storage so that customization is retained on subsequent app launches.

## 🎯 Definition of Done

- All user modifications to life areas (renaming, adding, removing, reordering) work as described.
- User interface validations ensure:
  - Life area names meet any defined length and uniqueness criteria.
  - The order of life areas is saved and reloaded correctly on app restart.
- Existing features related to life area management are verified; if some functionality is already implemented, only missing aspects should be developed.

## ❓ Refinement Questions

- Should we allow users to revert back to the default set of life areas? Yes.
- Is there a maximum number of custom life areas a user can add? No but there is a recommendation of around 10 areas as max.
- What specific validations should be applied when adding or renaming a life area (e.g., character limits, duplicate names)? Check for duplicate names.
- Is a drag-and-drop interface for reordering already implemented, and if so, does it provide a seamless experience on mobile devices? It is implemented but I have to test the feature on mobile devices.
- What additional guidance or suggestions should be provided to the user when customizing life areas?
- How should conflicts between predefined and custom life areas be handled (e.g., when renaming a predefined area to match a custom one)? Make sure the users understand that areas need to be unique.
- Are there analytics or recommendations related to life area gaps that need to update in real time when changes are made? Not at this point.
