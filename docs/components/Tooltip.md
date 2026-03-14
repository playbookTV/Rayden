# Tooltip

Contextual information popover with support for titles, actions, and multiple positions. Available in light and dark themes.

## Import

```tsx
import { Tooltip } from "@raydenui/ui";
import type { TooltipProps, TooltipPosition, TooltipTheme, TooltipAction } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<Tooltip content="This is a tooltip message" />
```

### With Title

```tsx
<Tooltip
  title="Getting Started"
  content="Click here to begin the onboarding process."
/>
```

### Themes

```tsx
// Light theme (default)
<Tooltip theme="light" content="Light tooltip" />

// Dark theme
<Tooltip theme="dark" content="Dark tooltip" />
```

### Positions

The tooltip supports 12 positions:

```tsx
// Top positions
<Tooltip position="top-left" content="Top left" />
<Tooltip position="top-center" content="Top center" />
<Tooltip position="top-right" content="Top right" />

// Bottom positions
<Tooltip position="bottom-left" content="Bottom left" />
<Tooltip position="bottom-center" content="Bottom center" />
<Tooltip position="bottom-right" content="Bottom right" />

// Left positions
<Tooltip position="left-top" content="Left top" />
<Tooltip position="left-center" content="Left center" />
<Tooltip position="left-bottom" content="Left bottom" />

// Right positions
<Tooltip position="right-top" content="Right top" />
<Tooltip position="right-center" content="Right center" />
<Tooltip position="right-bottom" content="Right bottom" />
```

### With Actions

```tsx
<Tooltip
  title="New Feature"
  content="We've added a new dashboard view."
  primaryAction={{
    label: "Try it",
    onClick: () => console.log("primary clicked"),
  }}
  secondaryAction={{
    label: "Dismiss",
    onClick: () => console.log("secondary clicked"),
  }}
/>
```

### Dismissible

```tsx
<Tooltip
  title="Tip"
  content="You can close this tooltip."
  onClose={() => console.log("closed")}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `"light" \| "dark"` | `"light"` | Color theme |
| `position` | `TooltipPosition` | `"top-left"` | Arrow and tooltip position |
| `title` | `string` | — | Optional title |
| `content` | `string` | — | **Required.** Tooltip content |
| `onClose` | `() => void` | — | Close button callback |
| `primaryAction` | `TooltipAction` | — | Primary action button |
| `secondaryAction` | `TooltipAction` | — | Secondary action button |
| `className` | `string` | — | Additional CSS classes |

### TooltipPosition Type

```tsx
type TooltipPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right"
  | "left-top" | "left-center" | "left-bottom"
  | "right-top" | "right-center" | "right-bottom";
```

### TooltipAction Type

```tsx
interface TooltipAction {
  label: string;
  onClick: () => void;
}
```

## Accessibility

- Close button has `aria-label="Close"`
- Focus management for keyboard users
- High contrast for readability

## Design Guidelines

### Themes

- **Light**: Default, works well on dark backgrounds
- **Dark**: Use on light backgrounds or for emphasis

### Positions

Position the tooltip to avoid covering important content. The arrow points to the trigger element.

### Best practices

- Keep content concise (1-2 sentences)
- Use titles sparingly for longer explanations
- Provide actions only when user response is needed
- Consider dismissibility for persistent tooltips
