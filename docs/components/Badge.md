# Badge

Compact visual indicators for status, counts, or labels. Supports multiple colors, types, and sizes.

## Import

```tsx
import { Badge } from "@raydenui/ui";
import type { BadgeProps, BadgeColor, BadgeType, BadgeSize } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<Badge>Default</Badge>
```

### Colors

```tsx
<Badge color="orange">Orange</Badge>
<Badge color="blue">Blue</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="error">Error</Badge>
<Badge color="neutral">Neutral</Badge>
<Badge color="disabled">Disabled</Badge>
```

### Types

```tsx
// Filled (default)
<Badge type="filled" color="success">Active</Badge>

// Accent (lighter background)
<Badge type="accent" color="success">Active</Badge>

// Outline (bordered)
<Badge type="outline" color="success">Active</Badge>
```

### Sizes

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### With Icons

```tsx
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

// Leading icon
<Badge color="success" leadingIcon={<CheckIcon />}>
  Verified
</Badge>

// Trailing icon
<Badge color="error" trailingIcon={<XMarkIcon />}>
  Failed
</Badge>

// Both icons
<Badge
  color="blue"
  leadingIcon={<StarIcon />}
  trailingIcon={<ChevronRightIcon />}
>
  Featured
</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `"orange" \| "blue" \| "success" \| "warning" \| "error" \| "neutral" \| "disabled"` | `"orange"` | Badge color |
| `type` | `"filled" \| "accent" \| "outline"` | `"filled"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | Badge size |
| `leadingIcon` | `ReactNode` | — | Icon before text |
| `trailingIcon` | `ReactNode` | — | Icon after text |
| `children` | `ReactNode` | — | Badge content |
| `className` | `string` | — | Additional CSS classes |

The component also accepts all native `<span>` HTML attributes.

## Accessibility

- Uses semantic `<span>` element
- Content is readable by screen readers
- Ensure color contrast meets WCAG guidelines

## Design Guidelines

### Color meanings

| Color | Use Case |
|-------|----------|
| `orange` | Primary brand, default highlighting |
| `blue` | Information, links, secondary |
| `success` | Completed, active, approved |
| `warning` | Caution, pending, attention needed |
| `error` | Failed, rejected, urgent |
| `neutral` | Default, inactive, general |
| `disabled` | Unavailable, archived |

### Type usage

- **Filled**: High emphasis, important status
- **Accent**: Medium emphasis, category labels
- **Outline**: Low emphasis, secondary info

### Sizing

- **Small (sm)**: Default, inline text
- **Medium (md)**: Slightly larger, standalone
- **Large (lg)**: Headers, prominent display
