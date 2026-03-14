# Divider

Content separator with multiple variants including plain lines, icons, labels, titles, and buttons.

## Import

```tsx
import { Divider } from "@raydenui/ui";
import type { DividerProps, DividerVariant } from "@raydenui/ui";
```

## Usage

### Default (Plain Line)

```tsx
<Divider />
```

### With Icon

```tsx
import { StarIcon } from "@heroicons/react/24/outline";

<Divider variant="with-icon" icon={<StarIcon />} />
```

### With Label

```tsx
<Divider variant="with-label" label="Or continue with" />
```

### With Title

```tsx
<Divider variant="with-title" label="Section Title" />
```

### With Button

```tsx
import { PlusIcon } from "@heroicons/react/20/solid";

<Divider
  variant="with-button"
  buttonLabel="Add Item"
  buttonIcon={<PlusIcon />}
  onButtonClick={() => console.log("clicked")}
/>
```

### With Title and Button

```tsx
<Divider
  variant="with-title-and-button"
  label="Team Members"
  buttonLabel="Invite"
  onButtonClick={() => console.log("invite clicked")}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `DividerVariant` | `"default"` | Divider style |
| `label` | `string` | — | Text label (for label/title variants) |
| `icon` | `ReactNode` | — | Icon element (for icon variant) |
| `buttonLabel` | `string` | — | Button text (for button variants) |
| `buttonIcon` | `ReactNode` | — | Button icon (for button variants) |
| `onButtonClick` | `() => void` | — | Button click callback |
| `className` | `string` | — | Additional CSS classes |

### DividerVariant Type

```tsx
type DividerVariant =
  | "default"
  | "with-icon"
  | "with-label"
  | "with-title"
  | "with-button"
  | "with-title-and-button";
```

## Design Guidelines

### Variant usage

| Variant | Use Case |
|---------|----------|
| `default` | Simple content separation |
| `with-icon` | Visual breaks with decorative icons |
| `with-label` | Alternative actions ("Or", "Or continue with") |
| `with-title` | Section headings within content |
| `with-button` | Inline actions (add, expand) |
| `with-title-and-button` | Section headers with actions |

### Best practices

- Use sparingly to avoid visual clutter
- Keep labels and titles concise
- Ensure sufficient spacing around dividers
- Use consistent variant patterns within a page
