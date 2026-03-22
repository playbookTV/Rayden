# Counter

Numeric input with increment/decrement controls.

## Import

```tsx
import { Counter, NumberCounter } from "@raydenui/ui";
```

## Usage

```tsx
// Basic counter
<Counter />

// Controlled counter
const [value, setValue] = useState(5);
<Counter value={value} onChange={setValue} />

// Number badge
<NumberCounter value={5} color="orange" />
```

## Counter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value (controlled) |
| `onChange` | `(value: number) => void` | — | Change callback |
| `defaultValue` | `number` | `0` | Initial value |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | Size variant |
| `shape` | `"rounded" \| "block" \| "pill"` | `"rounded"` | Border radius |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `Infinity` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |

## NumberCounter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | — | Display value (required) |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | Badge size |
| `color` | `"orange" \| "red" \| "grey" \| "white"` | `"orange"` | Background color |
