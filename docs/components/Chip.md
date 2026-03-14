# Chip

Compact interactive elements for input tags and filter selections. Supports close and dropdown actions.

## Import

```tsx
import { Chip } from "@raydenui/ui";
import type { ChipProps } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<Chip>Technology</Chip>
```

### Input Variant (with close button)

```tsx
<Chip variant="input" onClose={() => console.log("removed")}>
  React
</Chip>
```

### Filter Variant (with dropdown)

```tsx
<Chip variant="filter" onDropdown={() => console.log("open filter")}>
  Category
</Chip>
```

### With Icon

```tsx
import { TagIcon } from "@heroicons/react/16/solid";

<Chip icon={<TagIcon />} variant="input" onClose={() => {}}>
  JavaScript
</Chip>
```

### Disabled

```tsx
<Chip disabled>Disabled chip</Chip>

<Chip disabled variant="input" onClose={() => {}}>
  Cannot remove
</Chip>
```

### Focused State

Chips show a focused state when interacted with:

```tsx
<Chip tabIndex={0}>Focusable chip</Chip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"input" \| "filter"` | `"input"` | Chip variant |
| `icon` | `ReactNode` | — | Leading icon |
| `disabled` | `boolean` | `false` | Disables the chip |
| `onClose` | `() => void` | — | Close button callback (input variant) |
| `onDropdown` | `() => void` | — | Dropdown button callback (filter variant) |
| `children` | `ReactNode` | — | Chip content |
| `className` | `string` | — | Additional CSS classes |

The component also accepts all native `<div>` HTML attributes.

## Accessibility

- Close button has `aria-label="Remove"`
- Dropdown button has `aria-label="Open filter"`
- Disabled state prevents interaction
- Focus styles for keyboard navigation

## Design Guidelines

### Variants

- **Input**: For selected tags that can be removed (e.g., multi-select inputs)
- **Filter**: For filter criteria with dropdown options

### Best practices

- Keep chip labels short (1-3 words)
- Group related chips together
- Use icons sparingly for quick recognition
- Provide clear feedback when chips are added/removed
