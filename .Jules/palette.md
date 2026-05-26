# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - [ARIA Labels for Icon-only Buttons]
**Learning:** In a project with a strong visual-first design like Aimee, many buttons use icons exclusively for a clean look. However, this renders them invisible to screen readers and makes the interface less accessible.
**Action:** Always audit new components for icon-only buttons and provide descriptive `aria-label` attributes in the primary language of the application (Portuguese in this case).

## 2025-05-14 - [Decorative Element Management]
**Learning:** Visual-heavy elements like SVG backgrounds and "hero" illustrations can clutter the screen reader's view if not explicitly marked as decorative.
**Action:** Use `aria-hidden="true"` for purely decorative SVG and background elements to reduce noise for assistive technology.
