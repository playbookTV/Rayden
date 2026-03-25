# Token Usage

## Token Reference Syntax

Tokens are referenced using curly brace syntax that resolves against `tokens.dtcg.json`:

```
{group.subgroup.key}
```

## Available Token Groups

### Colors (`{color.*}`)

```
{color.primary.50}   → #FFECE5  (lightest)
{color.primary.500}  → #EB5017  (default)
{color.primary.900}  → #711E00  (darkest)

{color.grey.50}      → #F9FAFB  (backgrounds)
{color.grey.500}     → #667185  (muted text)
{color.grey.900}     → #101928  (headings)

{color.success.500}  → #099137
{color.error.500}    → #CB1A14
{color.warning.400}  → #F3A218
{color.info.400}     → #0BA5EC
```

### Spacing (`{spacing.*}`)

```
{spacing.1}   → 4px
{spacing.2}   → 8px
{spacing.3}   → 12px
{spacing.4}   → 16px (default padding)
{spacing.6}   → 24px (section padding)
{spacing.8}   → 32px (large padding)
```

### Border Radius (`{radius.*}`)

```
{radius.sm}   → 4px
{radius.md}   → 6px
{radius.lg}   → 8px
{radius.xl}   → 12px
{radius.full} → 9999px (circular)
```

### Typography

```
{typography.fontFamily.sans}     → Inter
{typography.fontSize.xs}         → 12px
{typography.fontSize.sm}         → 14px
{typography.fontSize.base}       → 16px
{typography.fontWeight.regular}  → 400
{typography.fontWeight.medium}   → 500
{typography.fontWeight.semibold} → 600
{typography.lineHeight.normal}   → 1.5
```

### Shadows (`{shadow.*}`)

```
{shadow.soft.sm}  → Subtle elevation
{shadow.soft.md}  → Modal, popover
{shadow.soft.lg}  → Large elevation
{shadow.hard.xs}  → Input focus
```

## Token Resolution

When building Figma components, resolve tokens before applying:

1. Read the token reference: `{color.primary.500}`
2. Look up in `tokens.dtcg.json`: `color.primary["500"].$value`
3. Apply the resolved value: `#EB5017`

## Tailwind Class Mapping

Each token has a corresponding Tailwind class in the `$extensions` field:

```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#EB5017",
        "$extensions": {
          "com.raydenui": {
            "tailwind": "primary-500"
          }
        }
      }
    }
  }
}
```

Use `bg-primary-500`, `text-primary-500`, `border-primary-500` in code.

## Component Token Patterns

### Button Tokens
- Background: `{color.[variant].500}` (solid), `transparent` (outlined)
- Text: `{color.grey.50}` (on dark), `{color.[variant].500}` (on light)
- Border: `{color.[variant].500}` when outlined
- Padding: `{spacing.4}` horizontal, `{spacing.2}` vertical (SM)

### Input Tokens
- Border default: `{color.grey.300}`
- Border focus: `{color.primary.200}`
- Border error: `{color.error.400}`
- Background: `{color.grey.50}`
- Text: `{color.grey.900}`

### Badge Tokens
- Filled background: `{color.[variant].500}`
- Accent background: `{color.[variant].50}`
- Text on filled: `{color.grey.50}`
- Text on accent: `{color.[variant].700}`
