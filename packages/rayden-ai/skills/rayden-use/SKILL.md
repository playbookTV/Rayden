---
name: rayden-use
version: 1.0.0
description: Build and maintain Rayden UI components in Figma
author: Ovalay Studios
rayden-ui-version: ">=0.2.0"
references:
  - ../../references/naming-conventions.md
  - ../../references/token-usage.md
  - ../../references/layout-rules.md
  - ../../references/component-properties.md
---

# Rayden Figma Skill

Build, extend, and maintain Rayden UI components directly in Figma using the `use_figma` MCP tool. This skill operates in **Mode C** — working entirely from bundled manifest files without requiring a connected Figma library.

## When to Use This Skill

Use this skill when:
- Building new Rayden UI components in Figma from scratch
- Adding variants or states to existing components
- Syncing a new `@raydenui/ui` React component to Figma
- Composing screens using Rayden components
- Auditing a file for Rayden design system compliance

Do NOT use this skill when:
- Implementing designs FROM Figma (use `get_design_context` instead)
- Working with non-Rayden design systems
- Creating freeform illustrations or graphics

## Prerequisites

1. **Figma MCP connected**: Verify with `mcp__claude_ai_Figma__whoami`
2. **Write access**: User must have Dev or Full seat on a paid Figma plan
3. **Target file open**: Have the Figma file key ready

## Operating Mode

This skill uses **Mode C (Manifest-only)**:
- All component specs come from `anatomy/components/*.json`
- All tokens come from `tokens/tokens.dtcg.json`
- No live Figma library connection required
- Creates local components (can be swapped to library instances later)

## Workflow

Follow these steps for every component build task:

### Step 1: Load Manifest Files

Read the required files:
```
1. anatomy/components.json — component registry
2. anatomy/components/[name].json — component anatomy spec
3. tokens/tokens.dtcg.json — design tokens (or use existing from context)
```

### Step 2: Resolve Tokens

Convert all token references to concrete values:
```
{color.primary.500} → #EB5017
{spacing.4} → 16px
{radius.lg} → 8px
```

### Step 3: Determine Variants to Build

Read the component registry to get all variant combinations:
```json
{
  "variants": ["Primary", "Secondary", ...],
  "appearances": ["Solid", "Outlined"],
  "sizes": ["SM", "LG"],
  "states": ["Default", "Hover", "Focus", "Disabled"]
}
```

Calculate total combinations. For Button: 8 × 2 × 2 × 4 = 128 variants.

### Step 4: Create Component Set

Use `use_figma` to create the component set structure:

```javascript
// Create parent component set frame
const componentSet = figma.createFrame();
componentSet.name = "Button";
componentSet.layoutMode = "HORIZONTAL";
componentSet.layoutWrap = "WRAP";
componentSet.itemSpacing = 20;
componentSet.paddingTop = 40;
componentSet.paddingBottom = 40;
componentSet.paddingLeft = 40;
componentSet.paddingRight = 40;
```

### Step 5: Build Each Variant

For each combination, create a component:

```javascript
// Create variant component
const variant = figma.createComponent();
variant.name = "Variant=Primary, Appearance=Solid, Size=SM, State=Default";

// Apply anatomy structure
variant.layoutMode = "HORIZONTAL";
variant.primaryAxisAlignItems = "CENTER";
variant.counterAxisAlignItems = "CENTER";
variant.itemSpacing = 8; // resolved from {spacing.2}
variant.paddingLeft = 16;
variant.paddingRight = 16;
variant.paddingTop = 8;
variant.paddingBottom = 8;
variant.cornerRadius = 8;

// Apply variant-specific fills
variant.fills = [{ type: "SOLID", color: hexToRgb("#EB5017") }];

// Create label text
const label = figma.createText();
await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
label.characters = "Button";
label.fontSize = 14;
label.fills = [{ type: "SOLID", color: hexToRgb("#F9FAFB") }];
variant.appendChild(label);
```

### Step 6: Create Component Properties

Add component properties to the set:

```javascript
// After creating all variants, combine into set
const set = figma.combineAsVariants(variants, componentSet);

// Add text property for label
set.addComponentProperty("Label", "TEXT", "Button");

// Add boolean for icon visibility
set.addComponentProperty("Show Icon Leading", "BOOLEAN", false);
```

### Step 7: Validate Output

Take a screenshot and verify:
- All variants are present
- Naming follows `ComponentName/Variant/State` pattern
- Colors match token values
- Spacing is consistent
- Auto layout is applied

## Naming Conventions

**CRITICAL**: All component names must follow this exact pattern:

```
Variant=Primary, Appearance=Solid, Size=SM, State=Default
```

For the Figma component set, use comma-separated property=value pairs.

For visual reference in designs:
```
Button/Primary/Solid/SM/Default
```

See: `references/naming-conventions.md`

## Token Resolution

All visual values must come from tokens. Never use hardcoded values.

```javascript
// CORRECT: Use resolved token value
variant.cornerRadius = 8; // from {radius.lg}

// INCORRECT: Hardcoded value without token reference
variant.cornerRadius = 8; // magic number
```

See: `references/token-usage.md`

## Layout Rules

Every frame must use auto layout. Never use absolute positioning.

```javascript
// CORRECT: Auto layout
frame.layoutMode = "HORIZONTAL";
frame.itemSpacing = 8;

// INCORRECT: Absolute positioning
child.x = 16;
child.y = 8;
```

See: `references/layout-rules.md`

## Component Properties

Standard properties every component should have:

| Property | Type | Purpose |
|----------|------|---------|
| Variant | VARIANT | Visual style |
| Size | VARIANT | Dimensions |
| State | VARIANT | Interaction state |
| Label | TEXT | Editable text |
| Show Icon | BOOLEAN | Toggle icon visibility |
| Icon | INSTANCE_SWAP | Icon selection |

See: `references/component-properties.md`

## Helper Functions

Include these in your `use_figma` code:

```javascript
// Convert hex to Figma RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Load Inter font (required for text)
async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}
```

## Example Prompts

### Build a component from scratch
```
"Use the rayden-use skill to build a Button component in this file: [figma-url]"
```

### Add variants to existing component
```
"Add Info and Warning variants to the existing Button component in: [figma-url]"
```

### Sync from React to Figma
```
"I've added a Tooltip component to @raydenui/ui. Build the matching Figma component."
```

### Compose a screen
```
"Build a login form using Rayden Input and Button components"
```

### Audit for compliance
```
"Check if the Button in this file uses Rayden tokens: [figma-url]"
```

## Error Handling

### Font not found
```javascript
// Always try/catch font loading
try {
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
} catch {
  // Fall back to available font
  await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
}
```

### Token not found
If a token reference cannot be resolved, log a warning and use a fallback:
```
Warning: Token {color.primary.600} not found, using {color.primary.500}
```

### Permission denied
If `use_figma` fails with permission error:
1. Verify user has Dev or Full Figma seat
2. Check file is not view-only
3. Confirm MCP connection with `whoami`

## Files Reference

| File | Purpose |
|------|---------|
| `anatomy/components.json` | Component registry |
| `anatomy/components/*.json` | Individual anatomy specs |
| `tokens/tokens.dtcg.json` | W3C DTCG tokens |
| `references/naming-conventions.md` | Naming rules |
| `references/token-usage.md` | Token patterns |
| `references/layout-rules.md` | Auto layout rules |
| `references/component-properties.md` | Property types |

## Version History

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial release — Mode C support, 4 component anatomies |
