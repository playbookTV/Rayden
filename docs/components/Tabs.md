# Tabs

Tabbed navigation component with line and pill variants. Supports controlled and uncontrolled modes with optional badges.

## Import

```tsx
import { Tabs, Tab } from "@raydenui/ui";
import type { TabsProps, TabsVariant, TabProps } from "@raydenui/ui";
```

## Usage

### Basic (Uncontrolled)

```tsx
<Tabs defaultValue="tab1">
  <Tab value="tab1">Dashboard</Tab>
  <Tab value="tab2">Settings</Tab>
  <Tab value="tab3">Profile</Tab>
</Tabs>
```

### Controlled

```tsx
const [activeTab, setActiveTab] = useState("tab1");

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <Tab value="tab1">Dashboard</Tab>
  <Tab value="tab2">Settings</Tab>
  <Tab value="tab3">Profile</Tab>
</Tabs>
```

### Variants

```tsx
// Line variant (default)
<Tabs variant="line" defaultValue="tab1">
  <Tab value="tab1">Overview</Tab>
  <Tab value="tab2">Analytics</Tab>
</Tabs>

// Pill variant
<Tabs variant="pill" defaultValue="tab1">
  <Tab value="tab1">Overview</Tab>
  <Tab value="tab2">Analytics</Tab>
</Tabs>
```

### With Icons

```tsx
import { HomeIcon, CogIcon } from "@heroicons/react/20/solid";

<Tabs defaultValue="home">
  <Tab value="home" icon={<HomeIcon />}>Home</Tab>
  <Tab value="settings" icon={<CogIcon />}>Settings</Tab>
</Tabs>
```

### With Badges

```tsx
<Tabs defaultValue="inbox">
  <Tab value="inbox" badge={12}>Inbox</Tab>
  <Tab value="sent" badge="99+">Sent</Tab>
  <Tab value="drafts">Drafts</Tab>
</Tabs>
```

### Disabled Tabs

```tsx
<Tabs defaultValue="tab1">
  <Tab value="tab1">Active</Tab>
  <Tab value="tab2" disabled>Disabled</Tab>
  <Tab value="tab3">Available</Tab>
</Tabs>
```

## Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"line" \| "pill"` | `"line"` | Visual style |
| `value` | `string` | — | Controlled active tab value |
| `defaultValue` | `string` | `""` | Initial active tab (uncontrolled) |
| `onValueChange` | `(value: string) => void` | — | Called when active tab changes |
| `children` | `ReactNode` | — | Tab components |
| `className` | `string` | — | Additional CSS classes |

## Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | **Required.** Unique tab identifier |
| `icon` | `ReactNode` | — | Icon element |
| `badge` | `number \| string` | — | Badge content |
| `disabled` | `boolean` | `false` | Disables the tab |
| `children` | `ReactNode` | — | Tab label content |
| `className` | `string` | — | Additional CSS classes |

## Accessibility

- Uses `role="tablist"` on container
- Uses `role="tab"` on tab buttons
- Supports `aria-selected` for active state
- Includes `disabled` attribute support

## Design Guidelines

### When to use each variant

- **Line**: Traditional tab navigation, content sections
- **Pill**: Filters, toggles, segmented controls

### Best practices

- Use clear, concise tab labels (1-2 words)
- Limit to 5-7 tabs maximum
- Consider using icons for quick recognition
- Use badges sparingly for important counts
