# Spinner

Loading indicators and spinners.

## Import

```tsx
import { Spinner } from "@raydenui/ui";
```

## Usage

```tsx
<Spinner />
<Spinner type="bold" size="lg" />
<Spinner label="Loading..." labelPosition="below" />
```

## Types

- `thin` - Thin rotating circle
- `bold` - Thick rotating circle
- `duo-tone` - Two-tone rotating circle
- `buffering-thin` - Thin buffering animation
- `buffering-bold` - Bold buffering animation
- `dot` - Circular dots with varying opacity
- `juggling` - Three bouncing dots

## Sizes

| Size | Pixels |
|------|--------|
| `xs` | 20px |
| `sm` | 24px |
| `md` | 32px |
| `lg` | 40px |
| `xl` | 48px |
| `2xl` | 56px |
| `3xl` | 64px |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `SpinnerType` | `"thin"` | Animation type |
| `size` | `SpinnerSize` | `"md"` | Spinner size |
| `colorStyle` | `"brand" \| "white"` | `"brand"` | Color scheme |
| `label` | `string` | — | Loading text |
| `labelPosition` | `"after" \| "before" \| "above" \| "below"` | `"after"` | Label placement |
