# Component Properties

Figma component properties define what users can customize when using a component instance.

## Property Types

### VARIANT

Controls which visual variation is displayed. Maps directly to component variant combinations.

```json
{
  "name": "Variant",
  "type": "VARIANT",
  "values": ["Primary", "Secondary", "Destructive"],
  "default": "Primary"
}
```

**Usage**: Mutually exclusive visual styles — only one can be active.

### INSTANCE_SWAP

Allows swapping a nested instance (like an icon) for a different one.

```json
{
  "name": "Icon Leading",
  "type": "INSTANCE_SWAP",
  "default": "icon/placeholder"
}
```

**Usage**: Icon slots, avatar images, custom nested components.

### BOOLEAN

Toggles visibility or a binary state.

```json
{
  "name": "Show Icon Leading",
  "type": "BOOLEAN",
  "default": false
}
```

**Usage**: Show/hide optional elements, toggle states.

### TEXT

Editable text content.

```json
{
  "name": "Label",
  "type": "TEXT",
  "default": "Button"
}
```

**Usage**: Labels, placeholder text, helper text.

## Standard Property Patterns

### Button Properties

| Property | Type | Values | Default |
|----------|------|--------|---------|
| Variant | VARIANT | Primary, Secondary, Grey, Destructive, Text, Success, Warning, Info | Primary |
| Appearance | VARIANT | Solid, Outlined | Solid |
| Size | VARIANT | SM, LG | SM |
| State | VARIANT | Default, Hover, Focus, Disabled | Default |
| Icon Leading | INSTANCE_SWAP | — | icon/placeholder |
| Icon Trailing | INSTANCE_SWAP | — | icon/placeholder |
| Show Icon Leading | BOOLEAN | — | false |
| Show Icon Trailing | BOOLEAN | — | false |
| Label | TEXT | — | "Button" |

### Input Properties

| Property | Type | Values | Default |
|----------|------|--------|---------|
| Size | VARIANT | XS, SM, MD, LG | MD |
| State | VARIANT | Default, Hover, Focus, Filled, Disabled, ReadOnly | Default |
| Validation | VARIANT | None, Error, Success | None |
| Show Label | BOOLEAN | — | true |
| Label | TEXT | — | "Label" |
| Placeholder | TEXT | — | "Placeholder text" |
| Helper Text | TEXT | — | "" |
| Show Helper Text | BOOLEAN | — | false |
| Leading Icon | INSTANCE_SWAP | — | icon/placeholder |
| Show Leading Icon | BOOLEAN | — | false |
| Trailing Icon | INSTANCE_SWAP | — | icon/placeholder |
| Show Trailing Icon | BOOLEAN | — | false |

### Badge Properties

| Property | Type | Values | Default |
|----------|------|--------|---------|
| Color | VARIANT | Orange, Blue, Success, Warning, Error, Neutral, Disabled | Neutral |
| Type | VARIANT | Filled, Accent, Outline | Accent |
| Size | VARIANT | SM, MD, LG | MD |
| Show Dot | BOOLEAN | — | false |
| Label | TEXT | — | "Badge" |

### Avatar Properties

| Property | Type | Values | Default |
|----------|------|--------|---------|
| Type | VARIANT | Image, Initials, Icon | Image |
| Size | VARIANT | XS, SM, MD, LG, XL, 2XL | MD |
| Status | VARIANT | None, Online, Offline, Verified | None |
| Initials | TEXT | — | "AB" |
| Icon | INSTANCE_SWAP | — | icon/user |

## Property Naming Conventions

1. **Use Title Case** for property names: "Icon Leading" not "iconLeading"
2. **Be specific** about the property's purpose: "Show Icon Leading" not "Has Icon"
3. **Use standard terms**: Variant, Size, State, Type (not Style, Dimension, Mode)
4. **Prefix visibility toggles** with "Show": "Show Label", "Show Helper Text"

## Relationship Between Properties

### Icon Visibility Pattern

Icons require two properties:
1. `Icon Leading` (INSTANCE_SWAP) — which icon to show
2. `Show Icon Leading` (BOOLEAN) — whether to show it

This allows the icon to be configured even when hidden, making it easy to toggle.

### Validation + Helper Text Pattern

Inputs use validation to control helper text styling:
- `Validation: None` → helper text is grey
- `Validation: Error` → helper text is red
- `Validation: Success` → helper text is green
