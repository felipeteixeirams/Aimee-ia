## 2025-02-14 - Localization and Accessibility
**Learning:** For apps with a primary language other than English (Portuguese in this case), ARIA labels MUST be localized to maintain a consistent experience for screen reader users.
**Action:** Always verify the application's primary language before adding user-facing strings or ARIA labels.
## 2026-05-25 - Project-wide ARIA Label Consistency
**Learning:** Many interactive icon-only elements (sidebar toggles, copy/edit buttons, voice recorders) across the app were missing descriptive `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Always audit new components for icon-only buttons and apply descriptive `aria-label`s, especially for state-dependent buttons (like recording toggles) where the label should update dynamically.
