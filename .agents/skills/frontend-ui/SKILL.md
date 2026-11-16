---
name: frontend-ui
version: 1.0.0
description: Production-grade responsive UI engineering, WCAG AA accessibility, tokenized layout systems, micro-interactions, and state resilience.
triggers:
  - "frontend feature"
  - "ui component"
  - "responsive design"
  - "accessible ui"
  - "tailwind styling"
negative_triggers:
  - "train model"
  - "sql migration"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# Frontend UI

## Activation and Load Discipline
- **Load when:** Authoring frontend components, styling user interfaces, implementing responsive layouts, or auditing web accessibility.
- **Do NOT load when:** Writing backend API routes or database queries.

## Purpose
Build resilient, accessible (WCAG AA), responsive, and visually consistent user interfaces adhering to modern design tokens and anti-slop principles.

## When to use
Use when developing React, Next.js, or HTML/Tailwind components, implementing responsive grids, and polishing UI interaction states.

## Inputs
- UI requirements, wireframes, or design tokens (colors, typography, spacing).
- Existing component library and icon sets.

## Procedure
1. **Semantic HTML Foundation:** Use proper HTML5 elements (`<nav>`, `<main>`, `<article>`, `<button>`, `<dialog>`). Avoid `div`-soup.
2. **Design Tokens & Spacing:** Adhere strictly to 4px/8px rhythm (`p-2`, `p-4`, `p-6`) and cohesive color palette (TokyoNight/Dark mode default).
3. **Responsive Breakpoints:** Build mobile-first. Verify layouts at 375px (mobile), 768px (tablet), and 1280px+ (desktop).
4. **State Resilience:** Explicitly implement all 5 interface states: Default, Hover/Focus, Loading skeleton, Empty state, and Error banner.
5. **Accessibility (a11y) Gate:** Ensure text contrast ratio >= 4.5:1, interactive elements have visible focus rings (`focus-visible:ring-2`), and form inputs have descriptive labels.
6. **Interaction & Motion:** Apply subtle, purposeful motion transitions (`transition-all duration-200 ease-out`). Avoid disorienting animations.

## Verification
- Semantic HTML valid and keyboard-navigable (`Tab` / `Enter` / `Space` / `Esc`).
- Color contrast meets WCAG AA (minimum 4.5:1 for normal text).
- Responsive layout verified across mobile and desktop viewport sizes.

## Safety
- Zero magic hardcoded inline hex colors or arbitrary px values when design tokens exist.
- Prohibit unhandled empty/error states that leave users stuck.

## Outputs
- Accessible, typed, and responsive UI components.
- Verified interaction states (loading, empty, error, active).
