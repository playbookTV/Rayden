# ProgressBar

Linear progress indicator for displaying completion status with optional label and metadata.

## Import

```tsx
import { ProgressBar } from "@raydenui/ui";
import type { ProgressBarProps, ProgressBarSize } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<ProgressBar value={65} />
```

### With Label

```tsx
<ProgressBar value={75} label="Upload progress" />
```

### With Metadata

```tsx
<ProgressBar
  value={42}
  label="Storage used"
  metadata="4.2 GB of 10 GB"
/>
```

### Sizes

```tsx
<ProgressBar size="sm" value={50} label="Small" />
<ProgressBar size="lg" value={50} label="Large" />
```

### Without Percentage

```tsx
<ProgressBar value={80} showPercentage={false} label="Loading..." />
```

### Dynamic Example

```tsx
const [progress, setProgress] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => Math.min(prev + 10, 100));
  }, 500);
  return () => clearInterval(timer);
}, []);

<ProgressBar value={progress} label="Uploading file" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value (0-100) |
| `size` | `"sm" \| "lg"` | `"lg"` | Bar height |
| `label` | `string` | — | Label above the bar |
| `metadata` | `string` | — | Additional info below the bar |
| `showPercentage` | `boolean` | `true` | Show percentage number |
| `className` | `string` | — | Additional CSS classes |

The component also accepts all native `<div>` HTML attributes.

## Accessibility

- Uses `role="progressbar"` for screen readers
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
- Progress value is clamped between 0-100

## Design Guidelines

### When to use

- File uploads and downloads
- Multi-step processes
- Loading states with known duration
- Storage or quota indicators

### Best practices

- Show percentage for processes with predictable completion
- Use metadata for additional context (file size, time remaining)
- Animate transitions for smooth feedback
- Consider showing a completion state at 100%
