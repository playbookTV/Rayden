# Input

Text input component with label, helper text, validation states, and icon support.

## Import

```tsx
import { Input } from "@raydenui/ui";
import type { InputProps, InputSize } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<Input placeholder="Enter your name" />
```

### With Label

```tsx
<Input label="Email" placeholder="you@example.com" />
```

### With Helper Text

```tsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
```

### Sizes

```tsx
<Input size="sm" placeholder="Small input" />
<Input size="lg" placeholder="Large input" />
```

### Validation States

```tsx
// Error state
<Input
  label="Email"
  error="Please enter a valid email address"
/>

// Success state
<Input
  label="Username"
  success="Username is available"
/>

// Boolean error (no message)
<Input label="Email" error={true} />
```

### With Icons

```tsx
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

// Leading icon
<Input
  leadingIcon={<MagnifyingGlassIcon />}
  placeholder="Search..."
/>

// Trailing icon
<Input
  trailingIcon={<XMarkIcon />}
  placeholder="Clearable input"
/>
```

### With Addon

```tsx
<Input
  label="Price"
  type="number"
  addonRight="USD"
/>
```

### States

```tsx
// Read-only
<Input readOnly value="Read-only value" />

// Disabled
<Input disabled placeholder="Disabled input" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "lg"` | `"sm"` | Input size |
| `label` | `string` | — | Label text above input |
| `helperText` | `string` | — | Helper text below input |
| `error` | `string \| boolean` | — | Error message or state |
| `success` | `string \| boolean` | — | Success message or state |
| `leadingIcon` | `ReactNode` | — | Icon on the left |
| `trailingIcon` | `ReactNode` | — | Icon on the right |
| `addonRight` | `string` | — | Text addon on the right |
| `wrapperClassName` | `string` | — | Class for the wrapper div |
| `disabled` | `boolean` | `false` | Disables the input |
| `readOnly` | `boolean` | `false` | Makes input read-only |

The component also accepts all native `<input>` HTML attributes (except `size`).

## Accessibility

- Associates label with input via `htmlFor`/`id`
- Uses appropriate `aria-invalid` for error states
- Supports keyboard navigation
- Maintains focus visibility

## Design Guidelines

### Validation

- Show validation feedback after user interaction (blur/submit)
- Use `error` for invalid input that blocks form submission
- Use `success` for positive confirmation (e.g., username available)
- Helper text should guide users before they input

### Icons

- Use leading icons for search, filter, or context
- Use trailing icons for actions (clear, reveal password)
- Keep icons simple and recognizable (20x20px)
