# Form Controls

A collection of form input components: Checkbox, Radio, and Toggle.

## Checkbox

Checkbox input for selecting one or more options from a list.

### Import

```tsx
import { Checkbox } from "@raydenui/ui";
import type { CheckboxProps } from "@raydenui/ui";
```

### Usage

#### Basic

```tsx
<Checkbox />
```

#### With Label

```tsx
<Checkbox label="Accept terms and conditions" />
```

#### With Description

```tsx
<Checkbox
  label="Marketing emails"
  description="Receive updates about new features and promotions"
/>
```

#### Label Position

```tsx
// Checkbox on the left (default)
<Checkbox label="Option A" position="left" />

// Checkbox on the right
<Checkbox label="Option B" position="right" />
```

#### States

```tsx
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />
```

### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `description` | `string` | — | Helper text below label |
| `position` | `"left" \| "right"` | `"left"` | Checkbox position relative to label |

Also accepts all native `<input type="checkbox">` attributes.

---

## Radio

Radio button for selecting exactly one option from a group.

### Import

```tsx
import { Radio } from "@raydenui/ui";
import type { RadioProps } from "@raydenui/ui";
```

### Usage

#### Basic Radio Group

```tsx
<div className="flex flex-col gap-3">
  <Radio name="plan" value="free" label="Free" />
  <Radio name="plan" value="pro" label="Pro" />
  <Radio name="plan" value="enterprise" label="Enterprise" />
</div>
```

#### With Description

```tsx
<Radio
  name="shipping"
  value="express"
  label="Express shipping"
  description="Delivered in 1-2 business days"
/>
```

#### Label Position

```tsx
<Radio label="Left position" position="left" />
<Radio label="Right position" position="right" />
```

#### States

```tsx
<Radio label="Selected" defaultChecked />
<Radio label="Disabled" disabled />
```

### Radio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `description` | `string` | — | Helper text below label |
| `position` | `"left" \| "right"` | `"left"` | Radio position relative to label |

Also accepts all native `<input type="radio">` attributes.

---

## Toggle

Switch/toggle input for boolean values (on/off states).

### Import

```tsx
import { Toggle } from "@raydenui/ui";
import type { ToggleProps } from "@raydenui/ui";
```

### Usage

#### Basic

```tsx
<Toggle />
```

#### With Label

```tsx
<Toggle label="Enable notifications" />
```

#### With Description

```tsx
<Toggle
  label="Dark mode"
  description="Use dark theme across the application"
/>
```

#### Label Position

```tsx
<Toggle label="Toggle on left" position="left" />
<Toggle label="Toggle on right" position="right" />
```

#### Controlled

```tsx
const [enabled, setEnabled] = useState(false);

<Toggle
  label="Feature flag"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

#### States

```tsx
<Toggle label="Enabled" defaultChecked />
<Toggle label="Disabled" disabled />
```

### Toggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text |
| `description` | `string` | — | Helper text below label |
| `position` | `"left" \| "right"` | `"left"` | Toggle position relative to label |

Also accepts all native `<input type="checkbox">` attributes.

---

## Accessibility

All form controls include:

- Proper `<label>` association
- Focus visible styles
- Disabled state styling
- `role="switch"` for Toggle component
- Keyboard navigation support

## Design Guidelines

### When to use each

| Component | Use Case |
|-----------|----------|
| Checkbox | Multiple selections, optional choices, terms acceptance |
| Radio | Single selection from mutually exclusive options |
| Toggle | Binary on/off settings, feature flags |

### Best practices

- Group related options together
- Use clear, concise labels
- Provide descriptions for complex options
- Indicate required fields when necessary
- Use consistent positioning within a form
