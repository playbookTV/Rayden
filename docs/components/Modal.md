# Modal

Dialog overlay for focused user interactions.

## Import

```tsx
import { Modal } from "@raydenui/ui";
```

## Usage

```tsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  primaryLabel="Confirm"
  onPrimaryClick={() => setOpen(false)}
  secondaryLabel="Cancel"
/>
```

## Sizes

- `sm` - 400px width
- `md` - 500px width
- `lg` - 640px width

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state (required) |
| `onClose` | `() => void` | — | Close callback (required) |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | Modal width |
| `title` | `string` | — | Title text |
| `description` | `string` | — | Description text |
| `icon` | `ReactNode` | — | Leading icon |
| `showClose` | `boolean` | `true` | Show close button |
| `primaryLabel` | `string` | `"Save"` | Primary button label |
| `onPrimaryClick` | `() => void` | — | Primary button callback |
| `secondaryLabel` | `string` | — | Secondary button label |
| `onSecondaryClick` | `() => void` | — | Secondary button callback |
| `footerOrientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Button layout |
| `closeOnOverlay` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `blur` | `boolean` | `true` | Backdrop blur effect |
| `children` | `ReactNode` | — | Modal body content |
