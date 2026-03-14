# ButtonGroup

Horizontal grouping of related buttons with connected styling and shared border radius.

## Import

```tsx
import { ButtonGroup, ButtonGroupItem } from "@raydenui/ui";
import type { ButtonGroupProps, ButtonGroupItemProps } from "@raydenui/ui";
```

## Usage

### Basic

```tsx
<ButtonGroup>
  <ButtonGroupItem>Option 1</ButtonGroupItem>
  <ButtonGroupItem>Option 2</ButtonGroupItem>
  <ButtonGroupItem>Option 3</ButtonGroupItem>
</ButtonGroup>
```

### With Active State

```tsx
const [selected, setSelected] = useState("left");

<ButtonGroup>
  <ButtonGroupItem
    active={selected === "left"}
    onClick={() => setSelected("left")}
  >
    Left
  </ButtonGroupItem>
  <ButtonGroupItem
    active={selected === "center"}
    onClick={() => setSelected("center")}
  >
    Center
  </ButtonGroupItem>
  <ButtonGroupItem
    active={selected === "right"}
    onClick={() => setSelected("right")}
  >
    Right
  </ButtonGroupItem>
</ButtonGroup>
```

### With Icons

```tsx
import { ListBulletIcon, Squares2X2Icon, TableCellsIcon } from "@heroicons/react/20/solid";

<ButtonGroup>
  <ButtonGroupItem leadingIcon={<ListBulletIcon />}>
    List
  </ButtonGroupItem>
  <ButtonGroupItem leadingIcon={<Squares2X2Icon />}>
    Grid
  </ButtonGroupItem>
  <ButtonGroupItem leadingIcon={<TableCellsIcon />}>
    Table
  </ButtonGroupItem>
</ButtonGroup>
```

### Icon Only

```tsx
<ButtonGroup>
  <ButtonGroupItem leadingIcon={<BoldIcon />} aria-label="Bold" />
  <ButtonGroupItem leadingIcon={<ItalicIcon />} aria-label="Italic" />
  <ButtonGroupItem leadingIcon={<UnderlineIcon />} aria-label="Underline" />
</ButtonGroup>
```

### With Disabled Items

```tsx
<ButtonGroup>
  <ButtonGroupItem>Available</ButtonGroupItem>
  <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
  <ButtonGroupItem>Available</ButtonGroupItem>
</ButtonGroup>
```

## ButtonGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | ButtonGroupItem components |
| `className` | `string` | — | Additional CSS classes |

## ButtonGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leadingIcon` | `ReactNode` | — | Icon before text |
| `trailingIcon` | `ReactNode` | — | Icon after text |
| `active` | `boolean` | `false` | Active/selected state |
| `disabled` | `boolean` | `false` | Disables the button |
| `children` | `ReactNode` | — | Button content |
| `className` | `string` | — | Additional CSS classes |

ButtonGroupItem also accepts all native `<button>` HTML attributes.

## Accessibility

- Uses `role="group"` on the container
- Supports keyboard navigation
- Active state for selection indication
- Disabled state for unavailable options

## Design Guidelines

### When to use

- View switchers (list/grid/table)
- Text formatting toolbars
- Segmented controls
- Related action groups

### Best practices

- Limit to 2-5 options
- Use consistent sizing within a group
- Only one active item at a time (for toggles)
- Consider using icons for compact layouts
- Provide `aria-label` for icon-only buttons
