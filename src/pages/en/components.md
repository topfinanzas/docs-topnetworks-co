# Components & UI System

TopNetworks maintains a centralized UI system built on **Tailwind CSS**, **Radix UI**, and **shadcn/ui** to ensure a visually consistent, accessible, and high-performance user experience across all properties.

## Core Design System

The TopNetworks identity is built around a vibrant, technology-forward aesthetic.

### Brand Palette

- **Brand Blue:** `#2563eb` (`blue-600`) - Primary brand color, main CTAs.
- **Brand Cyan:** `#0891b2` (`cyan-600`) - Secondary brand color, accents.
- **Brand Lime/Green:** `#84cc16` (`lime-500` / `green-600`) - Accent color, success indicators, vibrant highlights.

### Typography

- **Primary Font:** Poppins (Google Fonts). Used for all UI text, headings, and body copy.
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold).

### Gradients

The tri-color brand gradient is a signature element:

```css
.brand-gradient-text {
  @apply bg-gradient-to-r from-blue-600 via-cyan-600 to-lime-600 bg-clip-text text-transparent;
}
```

## Shared UI Architecture

### shadcn/ui & Radix UI

We utilize `shadcn/ui` for our base component layer. This provides fully accessible, unstyled primitives (via Radix UI) that we style with Tailwind CSS.

- Examples: Accordions, Dialogs, Dropdowns, Checkboxes, and Form controls.
- Found in: `components/ui/`

### Forms & Validation

- **React Hook Form:** For form state management.
- **Zod:** For schema-based validation.
- **Integration:** Combined via `@hookform/resolvers/zod` to ensure type-safe, accessible forms for lead capture and quizzes.

### Icons

- **Lucide React:** The official icon library across all TopNetworks applications.

## Component Patterns

### Buttons

Buttons utilize standard variants (primary, secondary, destructive, ghost). Primary actions often leverage the brand gradient:

```tsx
<button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200">
  Apply Now
</button>
```

### Layouts

- **Mobile-First:** All layouts are designed mobile-first.
- **Containers:** Content is constrained using Tailwind's `container` class or custom max-width wrappers.
- **Spacing:** Based on a standardized 4px/8px grid system (`gap-4`, `p-6`, etc.).

### Dark Mode

Dark mode is supported via Tailwind's `dark:` modifier. Colors dynamically shift to optimized dark variants (e.g., dark blue backgrounds with near-white foregrounds).
