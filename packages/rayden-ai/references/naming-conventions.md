# Naming Conventions

## Figma Component Naming

All Figma component names follow this exact pattern:

```
ComponentName/Variant/State
```

### Rules

| Rule | Detail |
|------|--------|
| **Format** | PascalCase for each segment |
| **Separator** | Forward slash `/` |
| **No spaces** | Never use spaces in any segment |
| **Order** | ComponentName / Variant / Appearance / Size / State |

### Standard Segments

**Variants** (visual style):
- Primary, Secondary, Grey, Destructive, Text, Success, Warning, Info

**Appearances** (fill style):
- Solid, Outlined

**Sizes**:
- XS, SM, MD, LG, XL, 2XL

**States** (interaction state):
- Default, Hover, Focus, Active, Disabled, Loading

**Validation** (for inputs):
- None, Error, Success

### Examples

```
Button/Primary/Solid/SM/Default
Button/Primary/Solid/SM/Hover
Button/Destructive/Outlined/LG/Disabled
Input/MD/Default
Input/MD/Error
Badge/Success/Accent/MD
Avatar/Initials/LG/Online
```

### What NOT to do

- ❌ `button/primary/default` (lowercase)
- ❌ `Button Primary Default` (spaces)
- ❌ `Button-Primary-Default` (dashes)
- ❌ `Button_Primary_Default` (underscores)
- ❌ `ButtonPrimaryDefault` (no separators)

## React Component Naming

Components are exported in PascalCase matching the component name:

```tsx
import { Button, Input, Badge, Avatar } from "@raydenui/ui";
```

Props use camelCase:

```tsx
<Button variant="primary" appearance="solid" size="sm" />
<Input size="md" error="Required field" />
```

## Token Reference Format

Tokens are referenced using curly brace syntax:

```
{group.subgroup.key}
```

Examples:
- `{color.primary.500}` → #EB5017
- `{spacing.4}` → 16px
- `{radius.md}` → 6px
- `{typography.fontFamily.sans}` → Inter
