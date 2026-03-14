# ProgressCircle

Circular progress indicator for displaying completion status. Available in multiple sizes with optional center text.

## Import

```tsx
import { ProgressCircle } from "@raydenui/ui";
import type { ProgressCircleProps, ProgressCircleSize } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<ProgressCircle value={75} />
```

### Sizes

```tsx
<ProgressCircle size="xs" value={50} />
<ProgressCircle size="sm" value={50} />
<ProgressCircle size="md" value={50} />
<ProgressCircle size="lg" value={50} />
<ProgressCircle size="xl" value={50} />
```

### Without Text

```tsx
<ProgressCircle value={60} showText={false} />
```

### Dynamic Example

```tsx
const [progress, setProgress] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
  }, 200);
  return () => clearInterval(timer);
}, []);

<ProgressCircle value={progress} size="xl" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value (0-100) |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Circle size |
| `showText` | `boolean` | `true` | Show percentage in center |
| `className` | `string` | — | Additional CSS classes |

The component also accepts all native `<div>` HTML attributes.

## Size Reference

| Size | Dimensions | Stroke Width | Font Size |
|------|------------|--------------|-----------|
| `xs` | 48px | 4px | 12px |
| `sm` | 56px | 5px | 12px |
| `md` | 72px | 6px | 14px |
| `lg` | 90px | 7px | 16px |
| `xl` | 120px | 8px | 18px |

## Accessibility

- Uses `role="progressbar"` for screen readers
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
- Progress value is clamped between 0-100

## Design Guidelines

### When to use

- Dashboard widgets and stats
- Skill or completion meters
- Loading indicators with known progress
- Compact progress displays

### Best practices

- Use appropriate size for the context
- Consider hiding text for very small sizes
- Animate for real-time progress updates
- Use consistent sizing across similar indicators
