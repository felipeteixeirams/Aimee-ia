# Palette's Journal - Critical UX/Accessibility Learnings

## 2026-05-25 - Project-wide ARIA Label Consistency
**Learning:** Many interactive icon-only elements (sidebar toggles, copy/edit buttons, voice recorders) across the app were missing descriptive `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Always audit new components for icon-only buttons and apply descriptive `aria-label`s, especially for state-dependent buttons (like recording toggles) where the label should update dynamically.

## 2025-05-14 - [Decorative Element Management]
**Learning:** Visual-heavy elements like SVG backgrounds and "hero" illustrations can clutter the screen reader's view if not explicitly marked as decorative.
**Action:** Use `aria-hidden="true"` for purely decorative SVG and background elements to reduce noise for assistive technology.
