# Stepper

Step indicators for multi-step processes.

## Import

```tsx
import { Stepper, LinearStepper, SegmentedStepper } from "@raydenui/ui";
```

## Usage

```tsx
// Step indicator
const steps = [
  { title: "Account" },
  { title: "Profile" },
  { title: "Review" },
];
<Stepper steps={steps} activeStep={1} />

// Linear progress
<LinearStepper currentStep={3} totalSteps={5} />

// Segmented progress
<SegmentedStepper currentStep={2} totalSteps={5} />
```

## Orientations

- `horizontal` - Horizontal layout (default)
- `vertical` - Vertical layout

## Indicators

- `dot` - Filled dot inside circle
- `number` - Step number (1-based)
- `icon` - Custom icon

## Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | — | Array of steps (required) |
| `activeStep` | `number` | — | Active step index (0-based) |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout |
| `indicator` | `"dot" \| "number" \| "icon"` | `"dot"` | Indicator style |

## StepItem

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Step title (required) |
| `description` | `string` | Description |
| `status` | `"completed" \| "active" \| "incomplete" \| "disabled"` | Status |
| `icon` | `ReactNode` | Custom icon |

## LinearStepper / SegmentedStepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentStep` | `number` | — | Current step (1-based, required) |
| `totalSteps` | `number` | — | Total steps (required) |
| `showLabel` | `boolean` | `true` | Show "X / Y complete" label |
