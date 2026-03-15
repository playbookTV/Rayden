# Icon

A comprehensive icon component with 200+ icons in both outline and solid variants.

## Import

```tsx
import { Icon } from "@raydenui/ui";
import type { IconProps, IconName, IconSize, IconVariant } from "@raydenui/ui";
```

## Usage

### Basic Usage

```tsx
<Icon name="home" />
<Icon name="user" />
<Icon name="settings" />
```

### Sizes

Icons support preset sizes or custom pixel values:

```tsx
<Icon name="star" size="xs" />  {/* 12px */}
<Icon name="star" size="sm" />  {/* 16px */}
<Icon name="star" size="md" />  {/* 20px - default */}
<Icon name="star" size="lg" />  {/* 24px */}
<Icon name="star" size="xl" />  {/* 32px */}

{/* Custom size in pixels */}
<Icon name="star" size={48} />
```

### Variants

Each icon has an outline (default) and solid variant:

```tsx
<Icon name="heart" variant="outline" />
<Icon name="heart" variant="solid" />
```

### Custom Color

Icons inherit the current text color by default. Override with the `color` prop:

```tsx
<Icon name="check" color="#0F973D" />
<Icon name="multiply" color="#D42620" />

{/* Or use Tailwind classes */}
<Icon name="bell" className="text-primary-400" />
```

### In Buttons and Inputs

Many Rayden UI components accept icon names directly:

```tsx
<Button icon="plus" iconPosition="leading">
  Add Item
</Button>

<Input leadingIcon="search" placeholder="Search..." />

<Tab value="home" icon="home">Home</Tab>
```

## API Reference

### IconProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | — | Icon name from the registry (required) |
| `size` | `IconSize \| number` | `"md"` | Preset size or pixel value |
| `color` | `string` | `"currentColor"` | SVG color via CSS `color` |
| `variant` | `IconVariant` | `"outline"` | `"outline"` or `"solid"` |
| `className` | `string` | — | Additional CSS classes |

### IconSize

```ts
type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
```

| Size | Pixels |
|------|--------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |

### IconVariant

```ts
type IconVariant = "outline" | "solid";
```

## Available Icons

The library includes 200+ icons organized by category:

**Navigation:** `home`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`, `menu`, `more-horizontal`, `more-vertical`

**Actions:** `plus`, `minus`, `multiply`, `check`, `edit`, `trash`, `copy`, `download`, `upload`, `search`, `filter`, `refresh`

**Communication:** `mail`, `phone`, `message`, `bell`, `send`, `inbox`

**Media:** `image`, `video`, `music`, `camera`, `play`, `pause`, `stop`

**Files:** `file`, `folder`, `document`, `archive`, `attachment`

**Users:** `user`, `users`, `user-plus`, `user-minus`

**Status:** `info`, `warning`, `error`, `success`, `help`

**UI:** `settings`, `calendar`, `clock`, `star`, `heart`, `bookmark`, `lock`, `unlock`, `eye`, `eye-off`

See Storybook for the complete icon gallery.

## Accessibility

- Icons have `aria-hidden="true"` by default since they're decorative
- When using icons alone (without text), provide an accessible label via `aria-label`

```tsx
<button aria-label="Close dialog">
  <Icon name="multiply" />
</button>
```
