# Design Tokens

Rayden UI includes a comprehensive design token system extracted from the [Rayna UI](https://www.figma.com/community/file/1229854793310881425) Figma design system. These tokens ensure consistency across all components and make theming straightforward.

## Overview

Design tokens are available in two ways:

1. **CSS Variables** - Used automatically via Tailwind CSS classes
2. **JavaScript/TypeScript** - Importable for programmatic use

## Using Tokens

### In Tailwind CSS Classes

All tokens are available as Tailwind v4 theme variables:

```tsx
// Colors
<div className="bg-primary-400 text-grey-900">Content</div>

// Shadows
<div className="shadow-soft-lg">Card with soft shadow</div>

// Typography
<p className="text-body-lg">Large body text</p>
```

### In JavaScript/TypeScript

```tsx
import { colors, shadows, spacing, typography, blurs, grid } from "@raydenui/ui/preset";

// Access any token
console.log(colors.primary[400]);  // "#F56630"
console.log(shadows.soft.lg);      // "0px 4px 6px..."
console.log(spacing[4]);           // "16px"
```

---

## Colors

### Primary

The primary color palette is a warm orange, used for main actions and brand elements.

| Token | Value | Preview |
|-------|-------|---------|
| `primary-50` | `#FFECE5` | ![#FFECE5](https://via.placeholder.com/40x20/FFECE5/FFECE5.png) |
| `primary-75` | `#FCD2C2` | ![#FCD2C2](https://via.placeholder.com/40x20/FCD2C2/FCD2C2.png) |
| `primary-100` | `#FCB59A` | ![#FCB59A](https://via.placeholder.com/40x20/FCB59A/FCB59A.png) |
| `primary-200` | `#FA9874` | ![#FA9874](https://via.placeholder.com/40x20/FA9874/FA9874.png) |
| `primary-300` | `#F77A4A` | ![#F77A4A](https://via.placeholder.com/40x20/F77A4A/F77A4A.png) |
| `primary-400` | `#F56630` | ![#F56630](https://via.placeholder.com/40x20/F56630/F56630.png) |
| `primary-500` | `#EB5017` | ![#EB5017](https://via.placeholder.com/40x20/EB5017/EB5017.png) |
| `primary-600` | `#CC400C` | ![#CC400C](https://via.placeholder.com/40x20/CC400C/CC400C.png) |
| `primary-700` | `#AD3307` | ![#AD3307](https://via.placeholder.com/40x20/AD3307/AD3307.png) |
| `primary-800` | `#8F2802` | ![#8F2802](https://via.placeholder.com/40x20/8F2802/8F2802.png) |
| `primary-900` | `#711E00` | ![#711E00](https://via.placeholder.com/40x20/711E00/711E00.png) |

### Secondary

A blue palette for secondary actions and informational elements.

| Token | Value | Preview |
|-------|-------|---------|
| `secondary-50` | `#E3EFFC` | ![#E3EFFC](https://via.placeholder.com/40x20/E3EFFC/E3EFFC.png) |
| `secondary-75` | `#C6DDF7` | ![#C6DDF7](https://via.placeholder.com/40x20/C6DDF7/C6DDF7.png) |
| `secondary-100` | `#B6D8FF` | ![#B6D8FF](https://via.placeholder.com/40x20/B6D8FF/B6D8FF.png) |
| `secondary-200` | `#80BBFF` | ![#80BBFF](https://via.placeholder.com/40x20/80BBFF/80BBFF.png) |
| `secondary-300` | `#3D89DF` | ![#3D89DF](https://via.placeholder.com/40x20/3D89DF/3D89DF.png) |
| `secondary-400` | `#1671D9` | ![#1671D9](https://via.placeholder.com/40x20/1671D9/1671D9.png) |
| `secondary-500` | `#0D5EBA` | ![#0D5EBA](https://via.placeholder.com/40x20/0D5EBA/0D5EBA.png) |
| `secondary-600` | `#034592` | ![#034592](https://via.placeholder.com/40x20/034592/034592.png) |
| `secondary-700` | `#04326B` | ![#04326B](https://via.placeholder.com/40x20/04326B/04326B.png) |
| `secondary-800` | `#012657` | ![#012657](https://via.placeholder.com/40x20/012657/012657.png) |
| `secondary-900` | `#001633` | ![#001633](https://via.placeholder.com/40x20/001633/001633.png) |

### Grey

Neutral tones for text, borders, and backgrounds.

| Token | Value | Usage |
|-------|-------|-------|
| `grey-50` | `#F9FAFB` | Subtle backgrounds |
| `grey-75` | `#F7F9FC` | Card backgrounds |
| `grey-100` | `#F0F2F5` | Dividers, input backgrounds |
| `grey-200` | `#E4E7EC` | Borders, disabled backgrounds |
| `grey-300` | `#D0D5DD` | Input borders, outlines |
| `grey-400` | `#98A2B3` | Placeholder text, icons |
| `grey-500` | `#667185` | Secondary text |
| `grey-600` | `#475367` | Body text |
| `grey-700` | `#344054` | Strong text |
| `grey-800` | `#1D2739` | Headings |
| `grey-900` | `#101928` | Primary text |

### Semantic Colors

#### Success

| Token | Value |
|-------|-------|
| `success-50` | `#E7F6EC` |
| `success-400` | `#0F973D` |
| `success-600` | `#04802E` |
| `success-700` | `#036B26` |

#### Error

| Token | Value |
|-------|-------|
| `error-50` | `#FBEAE9` |
| `error-400` | `#D42620` |
| `error-500` | `#CB1A14` |
| `error-700` | `#9E0A05` |

#### Warning

| Token | Value |
|-------|-------|
| `warning-50` | `#FEF6E7` |
| `warning-400` | `#F3A218` |
| `warning-500` | `#DD900D` |
| `warning-600` | `#AD6F07` |

#### Info

| Token | Value |
|-------|-------|
| `info-400` | `#0BA5EC` |
| `info-500` | `#0086C9` |

---

## Shadows

### Soft Shadows

Subtle, diffused shadows for a gentle elevation effect.

| Token | Value |
|-------|-------|
| `shadow-soft-xxs` | `0px 1.5px 4px -1px rgba(16, 25, 40, 0.07)` |
| `shadow-soft-xs` | `0px 2px 4px -1px rgba(16, 25, 40, 0.02), 0px 5px 13px -5px rgba(16, 25, 40, 0.05)` |
| `shadow-soft-sm` | `0px 10px 18px -2px rgba(16, 25, 40, 0.07)` |
| `shadow-soft-md` | `0px 0px 3px -1px rgba(16, 25, 40, 0.04), 0px 14px 22px -9px rgba(16, 25, 40, 0.14)` |
| `shadow-soft-lg` | `0px 4px 6px -2px rgba(16, 25, 40, 0.03), 0px 16px 24px -4px rgba(16, 25, 40, 0.08)` |
| `shadow-soft-xl` | `0px 8px 8px -4px rgba(16, 25, 40, 0.03), 0px 24px 32px -4px rgba(16, 25, 40, 0.08)` |
| `shadow-soft-2xl` | `0px 32px 54px -12px rgba(16, 25, 40, 0.18)` |
| `shadow-soft-3xl` | `0px 40px 72px -12px rgba(16, 25, 40, 0.14)` |

### Hard Shadows

Defined shadows with visible edges for stronger elevation.

| Token | Value |
|-------|-------|
| `shadow-hard-xxs` | `0px 2px 5px -2px rgba(16, 25, 40, 0.06), 0px 2px 7px 0px rgba(16, 25, 40, 0.05), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)` |
| `shadow-hard-xs` | `0px 2px 12px -1px rgba(16, 25, 40, 0.1), 0px 2px 2px -1px rgba(16, 25, 40, 0.04), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)` |
| `shadow-hard-sm` | `0px 6px 16px 0px rgba(16, 25, 40, 0.08), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)` |
| `shadow-hard-md` | `0px 0px 3px -1px rgba(16, 25, 40, 0.04), 0px 16px 24px -6px rgba(16, 25, 40, 0.08), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)` |

---

## Typography

Manrope gives headings a distinct voice. Hanken Grotesk carries paragraphs, navigation, buttons, form labels, and other interface text. Code uses the local Mac stack: SF Mono, SFMono-Regular, then Menlo, with platform fallbacks elsewhere.

| Role | Family utility | Default weight |
| --- | --- | --- |
| Display | `font-heading` (Manrope) | 700 |
| Headings | `font-heading` (Manrope) | 600 |
| Body | `font-sans` (Hanken Grotesk) | 400 |
| Navigation and interface labels | `font-sans` (Hanken Grotesk) | 500 |
| Eyebrows and metadata | `font-sans` (Hanken Grotesk) | 500 |
| Code | `font-mono` (SF Mono / Menlo) | 400 |

### Role scale

Sizes use `rem` so they follow the reader's default text size. Pixel equivalents below assume a 16px root. Line heights are unitless. Each semantic `text-*` utility includes size, line height, tracking, and default weight. Display, heading, label, and code utilities also select their font family; body and caption utilities inherit the surrounding family. Use `font-sans` explicitly when placing body text inside a heading.

| Utility | Size | At 16px root | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- | --- |
| `text-display-lg` | 3.5rem | 56px | 1.1 | -0.03em | 700 |
| `text-display-sm` | 3rem | 48px | 1.1 | -0.03em | 700 |
| `text-h1` | 2.5rem | 40px | 1.2 | -0.03em | 600 |
| `text-h2` | 2.25rem | 36px | 1.2 | -0.03em | 600 |
| `text-h3` | 2rem | 32px | 1.2 | -0.02em | 600 |
| `text-h4` | 1.75rem | 28px | 1.2 | -0.02em | 600 |
| `text-h5` | 1.5rem | 24px | 1.2 | -0.02em | 600 |
| `text-h6` | 1.25rem | 20px | 1.2 | -0.02em | 600 |
| `text-body-lg` | 1.125rem | 18px | 1.5 | 0 | 400 |
| `text-body-md` | 1rem | 16px | 1.5 | 0 | 400 |
| `text-body-sm` | 0.875rem | 14px | 1.5 | 0 | 400 |
| `text-body-xs` | 0.75rem | 12px | 1.5 | 0 | 400 |
| `text-caption-lg` | 0.875rem | 14px | 1.5 | 0.08em | 500 |
| `text-caption-sm` | 0.75rem | 12px | 1.5 | 0.08em | 500 |
| `text-caption-xs` | 0.75rem | 12px | 1.5 | 0.08em | 500 |
| `text-label-lg` | 1rem | 16px | 1.5 | 0 | 500 |
| `text-label-md` | 0.875rem | 14px | 1.42857 | 0 | 500 |
| `text-label-sm` | 0.75rem | 12px | 1.33333 | 0 | 500 |
| `text-code-md` | 0.875rem | 14px | 1.6 | 0 | 400 |
| `text-code-sm` | 0.75rem | 12px | 1.5 | 0 | 400 |

### Applying the system

```tsx
<section className="space-y-6">
  <h1 className="text-h3 md:text-h1">Your workspace, connected</h1>
  <p className="text-body-md prose-measure">
    Keep projects, conversations, and decisions in one place.
  </p>
  <nav aria-label="Workspace" className="font-sans text-label-md">
    <a href="/projects">Projects</a>
  </nav>
  <pre className="text-code-md overflow-x-auto"><code>npm install @raydenui/ui</code></pre>
</section>
```

- Choose heading elements for document structure, then choose their visual size with utilities. Heading tags automatically use Manrope; they do not impose a new size on existing components.
- Use `text-h3 md:text-h1` or `text-h2 md:text-display-lg` for responsive titles. Large display sizes are for short headlines, not dense panels.
- Use `text-body-md` for reading text and `prose-measure` to cap long paragraphs at 65 characters. `text-body-sm` is for secondary text, not the default reading size.
- Use `text-label-md` for controls and navigation. Use `text-label-lg` for mobile inputs; do not reduce the document's root size to fit a layout.
- Keep small labels in sentence case. Add `uppercase` to `text-caption-*` only for short eyebrows; `caption-xs` remains a compatibility alias at 12px, matching `caption-sm`.
- Heading utilities balance line wrapping. Code blocks should scroll horizontally. Apply `tabular-nums` to changing values and table numbers.
- `font-medium`, `font-semibold`, and `font-bold` can override a role's default weight. Manrope is upright only; use Hanken Grotesk for true italic emphasis.

---

## Spacing

Based on a 4px grid system.

| Token | Value |
|-------|-------|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `5` | 20px |
| `6` | 24px |
| `7` | 28px |
| `8` | 32px |
| `10` | 40px |
| `12` | 48px |
| `16` | 64px |
| `20` | 80px |
| `24` | 96px |
| `32` | 128px |
| `40` | 160px |
| `48` | 192px |

---

## Blurs

For backdrop and filter blur effects.

| Token | Value |
|-------|-------|
| `blur-xs` | 2px |
| `blur-sm` | 4px |
| `blur-md` | 12px |
| `blur-lg` | 16px |
| `blur-xl` | 20px |

---

## Grid & Breakpoints

### Breakpoints

| Token | Value |
|-------|-------|
| `sm` | 320px |
| `md` | 600px |
| `lg` | 1136px |

### Grid Columns

The grid system adapts to different screen sizes:

- **Small (320px+)**: 4 or 6 columns, 16px margin, 12px gutter
- **Medium (600px+)**: 6 or 8 columns, 32px margin, 20px gutter
- **Large (1136px+)**: 12 columns, 112px margin, 32px gutter
- **Fluid**: 12 columns, 24px margin, 24px gutter

---

## Font Family

Import the shared styles and optional self-hosted fonts once in your application:

```css
@import "tailwindcss";
@import "@raydenui/ui/styles.css";
@import "@raydenui/ui/fonts.css";
```

`fonts.css` ships variable WOFF2 subsets, including Hanken Grotesk's true italic, with `font-display: swap`. Browsers fetch only the subsets and styles used on the page. Both font licenses are included in the package. SF Mono and Menlo are resolved locally; Rayden does not download or redistribute them.

If you already load these families yourself, omit `fonts.css`. The styles retain system fallbacks when webfonts are unavailable. Override `--font-heading`, `--font-sans`, and `--font-mono` to customize the family roles:

```css
@theme {
  --font-heading: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

The JavaScript `typography` and `fontFamily` exports from `@raydenui/ui/preset`, the CSS utilities, and the AI/DTCG tokens describe the same role system.
