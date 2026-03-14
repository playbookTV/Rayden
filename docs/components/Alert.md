# Alert

Notification component for displaying important messages. Supports toast (inline) and banner (full-width) variants with action buttons.

## Import

```tsx
import { Alert } from "@raydenui/ui";
import type { AlertProps, AlertVariant, AlertState, AlertAction } from "@raydenui/ui";
```

## Usage

### Basic Toast

```tsx
<Alert
  title="Update available"
  description="A new version of the app is ready to install."
/>
```

### With Icon

```tsx
import { InformationCircleIcon } from "@heroicons/react/24/outline";

<Alert
  icon={<InformationCircleIcon />}
  title="Heads up!"
  description="Your session will expire in 5 minutes."
/>
```

### States

```tsx
// Information (default)
<Alert
  state="information"
  title="New feature"
  description="Check out our new dashboard."
  icon={<InfoIcon />}
/>

// Success
<Alert
  state="success"
  title="Payment successful"
  description="Your payment has been processed."
  icon={<CheckIcon />}
/>

// Warning
<Alert
  state="warning"
  title="Storage almost full"
  description="You've used 90% of your storage."
  icon={<ExclamationIcon />}
/>

// Error
<Alert
  state="error"
  title="Upload failed"
  description="Unable to upload the file. Please try again."
  icon={<XCircleIcon />}
/>
```

### Variants

```tsx
// Toast (compact, inline)
<Alert
  variant="toast"
  state="success"
  title="Saved"
  description="Your changes have been saved."
/>

// Banner (full-width with actions)
<Alert
  variant="banner"
  state="information"
  title="Welcome to Rayden UI"
  description="Get started by exploring our component library."
  primaryAction={{
    label: "Get Started",
    onClick: () => console.log("clicked"),
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => console.log("learn more"),
  }}
/>
```

### Dismissible

```tsx
const [show, setShow] = useState(true);

{show && (
  <Alert
    title="Notification"
    description="This alert can be dismissed."
    onClose={() => setShow(false)}
  />
)}
```

### Without Icon

```tsx
<Alert
  showIcon={false}
  title="Simple alert"
  description="This alert has no icon."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"toast" \| "banner"` | `"toast"` | Display variant |
| `state` | `"information" \| "success" \| "warning" \| "error"` | `"information"` | Alert state/color |
| `title` | `string` | — | Alert title |
| `description` | `string` | — | Alert description |
| `icon` | `ReactNode` | — | Custom icon element |
| `showIcon` | `boolean` | `true` | Whether to show the icon |
| `onClose` | `() => void` | — | Close button callback |
| `primaryAction` | `AlertAction` | — | Primary action button (banner only) |
| `secondaryAction` | `AlertAction` | — | Secondary action button (banner only) |
| `className` | `string` | — | Additional CSS classes |

### AlertAction Type

```tsx
interface AlertAction {
  label: string;
  onClick: () => void;
}
```

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Close button has `aria-label="Close"`
- Color is not the only indicator of state (icons are included)

## Design Guidelines

### Variants

- **Toast**: Quick, inline notifications. Use for confirmations and minor updates.
- **Banner**: Important announcements requiring attention or action.

### States

- **Information**: Neutral updates, tips, or general notices
- **Success**: Confirmations of completed actions
- **Warning**: Potential issues requiring attention
- **Error**: Failed actions or critical issues

### Best practices

- Keep titles short (3-5 words)
- Descriptions should be actionable when possible
- Use primary action for the main response
- Allow users to dismiss non-critical alerts
