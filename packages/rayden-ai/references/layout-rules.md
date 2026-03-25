# Layout Rules

## Auto Layout Requirements

Every frame MUST use auto layout. Never use absolute positioning for component internals.

### Auto Layout Properties

| Property | Usage |
|----------|-------|
| `layoutMode` | `HORIZONTAL` for row layouts, `VERTICAL` for stacks |
| `layoutAlign` | `CENTER` for buttons, `STRETCH` for inputs |
| `itemSpacing` | Always use spacing tokens: `{spacing.2}`, `{spacing.4}` |
| `primaryAxisSizingMode` | `AUTO` to hug contents, `FIXED` for fixed width |
| `counterAxisSizingMode` | `AUTO` to hug contents, `FIXED` for fixed height |

### Padding Rules

Always reference spacing tokens, never raw pixel values:

```
paddingHorizontal: "{spacing.4}"  ✓
paddingHorizontal: "16px"         ✗

paddingVertical: "{spacing.2}"    ✓
paddingVertical: "8px"            ✗
```

### Standard Component Padding

| Component | Horizontal | Vertical |
|-----------|------------|----------|
| Button SM | `{spacing.4}` (16px) | `{spacing.2}` (8px) |
| Button LG | `{spacing.6}` (24px) | `{spacing.4}` (16px) |
| Input | `{spacing.3}` (12px) | `{spacing.2}` (8px) |
| Badge | `{spacing.2}` (8px) | `{spacing.1}` (4px) |

## Sizing Modes

### Hug Contents

Use for most components — size determined by content:

```json
{
  "primaryAxisSizingMode": "AUTO",
  "counterAxisSizingMode": "AUTO"
}
```

### Fill Container

Use for full-width elements inside a parent:

```json
{
  "layoutGrow": 1,
  "primaryAxisSizingMode": "FIXED"
}
```

### Fixed Size

Use when explicit dimensions are required:

```json
{
  "width": 200,
  "height": 44
}
```

## Gap (Item Spacing)

Standard gaps between child elements:

| Gap | Token | Usage |
|-----|-------|-------|
| Tight | `{spacing.1}` (4px) | Icon + text in buttons |
| Normal | `{spacing.2}` (8px) | Form fields, button groups |
| Comfortable | `{spacing.4}` (16px) | Section content |
| Spacious | `{spacing.6}` (24px) | Major sections |

## Corner Radius

| Size | Token | Usage |
|------|-------|-------|
| Small | `{radius.sm}` (4px) | Badges, small elements |
| Medium | `{radius.md}` (6px) | Inputs, cards |
| Large | `{radius.lg}` (8px) | Buttons, modals |
| Full | `{radius.full}` | Avatars, pills |

## Layout Direction

### Horizontal (Row)

Use for: buttons, badges, input containers, navigation

```json
{
  "layoutMode": "HORIZONTAL",
  "layoutAlign": "CENTER"
}
```

### Vertical (Stack)

Use for: form groups, card content, menus

```json
{
  "layoutMode": "VERTICAL",
  "layoutAlign": "STRETCH"
}
```

## Constraints

### Minimum Sizes

| Component | Min Width | Min Height |
|-----------|-----------|------------|
| Button | 80px | 36px (SM), 56px (LG) |
| Input | 200px | 32px (XS), 52px (LG) |
| Badge | 24px | 20px |
| Avatar | 24px | 24px |

### Maximum Sizes

Generally, components should not have max constraints — they grow with content. Exception: modals and tooltips.
