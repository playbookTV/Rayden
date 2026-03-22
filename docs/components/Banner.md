# Banner

Alert banners for notifications and announcements.

## Import

```tsx
import { Banner } from "@raydenui/ui";
```

## Usage

```tsx
<Banner title="New feature available" />

<Banner
  status="success"
  emphasis="bold"
  title="Payment successful"
  description="Your order has been confirmed."
/>
```

## Status Variants

- `information` - Blue
- `success` - Green
- `error` - Red
- `warning` - Yellow
- `feature` - Dark grey
- `opportunity` - Indigo

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"information" \| "success" \| "error" \| "warning" \| "feature" \| "opportunity"` | `"information"` | Color scheme |
| `emphasis` | `"bold" \| "subtle"` | `"subtle"` | Background style |
| `size` | `"sm" \| "lg"` | `"lg"` | Banner height |
| `title` | `string` | — | Headline text (required) |
| `description` | `string` | — | Description text |
| `icon` | `ReactNode \| IconName` | — | Leading icon |
| `buttonLabel` | `string` | — | Action button label |
| `onButtonClick` | `() => void` | — | Action button callback |
| `dismissible` | `boolean` | `true` | Show close button |
| `onDismiss` | `() => void` | — | Close callback |
