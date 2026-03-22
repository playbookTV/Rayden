# Slider

Drag sliders for numeric value selection.

## Import

```tsx
import { Slider, RangeSlider } from "@raydenui/ui";
```

## Usage

```tsx
// Basic slider
<Slider />

// Controlled slider
const [value, setValue] = useState(50);
<Slider value={value} onChange={setValue} />

// Range slider
const [range, setRange] = useState<[number, number]>([25, 75]);
<RangeSlider value={range} onChange={setRange} />
```

## Sizes

- `sm` - 4px track, 14px handle
- `md` - 8px track, 16px handle
- `lg` - 12px track, 20px handle

## Slider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value (0-100) |
| `onChange` | `(value: number) => void` | — | Change callback |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Track/handle size |
| `label` | `string` | — | Label above slider |
| `metadata` | `string \| string[]` | — | Text below slider |
| `showPercentage` | `boolean` | `true` | Show percentage |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |

## RangeSlider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[number, number]` | — | Range [low, high] |
| `onChange` | `(value: [number, number]) => void` | — | Change callback |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Size |
| `label` | `string` | — | Label |
| `showLabels` | `boolean` | `true` | Show min/max labels |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `step` | `number` | `1` | Step |
| `disabled` | `boolean` | `false` | Disabled |
