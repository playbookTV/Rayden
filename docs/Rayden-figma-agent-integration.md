# Rayden UI — Figma Agent Integration
**Technical Specification & Developer Guide**
Version 1.0 · March 2026 · Ovalay Studios

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Manifest Format](#3-manifest-format)
4. [Operating Modes](#4-operating-modes)
5. [Skill File Specification](#5-skill-file-specification)
6. [Distribution](#6-distribution)
7. [Figma Setup Requirements](#7-figma-setup-requirements)
8. [Extending the Manifest](#8-extending-the-manifest)
9. [Example Prompts](#9-example-prompts)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

Rayden AI is an agent layer over the Rayden UI design system that can create, extend, and maintain design components directly inside Figma — without requiring the Rayna UI library to be connected to the working file. It uses a self-contained component manifest (JSON) as its source of truth, falls back gracefully through three operating modes, and works entirely from disk in the absence of any live Figma library connection.

This document covers the architecture of the system, the manifest format, the skill specification, operating modes, distribution, and how to extend it as the Rayden component library grows.

---

## 2. Architecture

The system has three layers. They are deliberately decoupled so each can be updated independently.

| Layer | What it is | Lives in |
|---|---|---|
| Skill | `SKILL.md` — instructions for the agent on how to operate in Figma | `skills/rayden-use/SKILL.md` |
| Manifest | JSON files describing every token and component anatomy | `skills/rayden-use/manifest/` |
| Figma MCP | `use_figma` tool — writes to the Figma canvas based on skill instructions | Hosted by Figma (remote server) |

The agent reads the skill first, then the manifest, then acts on the canvas. It never requires a live Figma library connection to produce correct output — the manifest contains everything it needs to reconstruct any component accurately.

### 2.1 Agent workflow

1. User prompts Rayden AI in Claude Code or Cursor.
2. Agent loads `SKILL.md` to understand system conventions and operating rules.
3. Agent determines which operating mode applies (see [Section 4](#4-operating-modes)).
4. Agent loads `manifest/tokens.json` and the relevant component JSON file.
5. Agent resolves all token aliases to concrete values.
6. Agent calls `use_figma` to build or modify components on the Figma canvas.
7. Agent screenshots output and iterates on mismatches.
8. If Code Connect is configured, agent maps Figma nodes to `@raydenui/ui` paths.

### 2.2 What the agent can do

- Create new component sets from a description, using Rayden tokens and naming conventions
- Add variants or states to existing components
- Compose screens and flows using Rayden components
- Sync a new `@raydenui/ui` React component to a Figma counterpart
- Detect token drift between a client file and the Rayden manifest
- Correct non-conforming naming or hardcoded values in a Figma file

---

## 3. Manifest Format

The manifest is a collection of JSON files that travel with the skill. It is the authoritative source of truth for the Rayden design system — not the Figma library. Every value the agent uses to build on the canvas originates here.

### 3.1 File structure

```
skills/rayden-use/
  SKILL.md
  manifest/
    tokens.json          # All design tokens (W3C DTCG format)
    components.json      # Component registry (index)
    components/
      button.json        # Full anatomy + variant specs
      input.json
      card.json
      badge.json
      avatar.json
      ...
```

### 3.2 `tokens.json` — W3C DTCG format

Tokens follow the W3C Design Tokens Community Group specification (stable release 2025.10). This is the same format used by Tokens Studio, Style Dictionary, and other major tooling, giving you a migration path to any platform.

Every value in a component spec is a token alias in the form `{group.key}`. The agent resolves these against `tokens.json` before making any `use_figma` call.

```json
{
  "color": {
    "$type": "color",
    "primary": {
      "500": { "$value": "#2563EB", "$description": "Brand blue, primary action" },
      "600": { "$value": "#1D4ED8", "$description": "Hover state" },
      "100": { "$value": "#DBEAFE", "$description": "Subtle background" }
    },
    "neutral": {
      "0":   { "$value": "#FFFFFF" },
      "100": { "$value": "#F3F4F6" },
      "200": { "$value": "#E5E7EB" },
      "500": { "$value": "#6B7280" },
      "700": { "$value": "#374151" },
      "900": { "$value": "#111827" }
    },
    "danger":  { "500": { "$value": "#EF4444" }, "100": { "$value": "#FEE2E2" } },
    "success": { "500": { "$value": "#22C55E" }, "100": { "$value": "#DCFCE7" } },
    "warning": { "500": { "$value": "#F59E0B" }, "100": { "$value": "#FEF3C7" } }
  },
  "spacing": {
    "$type": "dimension",
    "1":  { "$value": "4px" },
    "2":  { "$value": "8px" },
    "3":  { "$value": "12px" },
    "4":  { "$value": "16px" },
    "6":  { "$value": "24px" },
    "8":  { "$value": "32px" },
    "10": { "$value": "40px" },
    "12": { "$value": "48px" }
  },
  "radius": {
    "$type": "dimension",
    "sm":   { "$value": "4px" },
    "md":   { "$value": "8px" },
    "lg":   { "$value": "12px" },
    "xl":   { "$value": "16px" },
    "full": { "$value": "9999px" }
  },
  "typography": {
    "fontFamily": {
      "sans": { "$type": "fontFamily", "$value": "Inter" }
    },
    "fontSize": {
      "$type": "dimension",
      "xs":   { "$value": "12px" },
      "sm":   { "$value": "14px" },
      "base": { "$value": "16px" },
      "lg":   { "$value": "18px" },
      "xl":   { "$value": "20px" },
      "2xl":  { "$value": "24px" }
    },
    "fontWeight": {
      "regular":  { "$type": "number", "$value": 400 },
      "medium":   { "$type": "number", "$value": 500 },
      "semibold": { "$type": "number", "$value": 600 },
      "bold":     { "$type": "number", "$value": 700 }
    },
    "lineHeight": {
      "$type": "number",
      "tight":   { "$value": 1.25 },
      "normal":  { "$value": 1.5 },
      "relaxed": { "$value": 1.75 }
    }
  },
  "shadow": {
    "$type": "shadow",
    "sm": { "$value": "0 1px 2px rgba(0,0,0,0.05)" },
    "md": { "$value": "0 4px 6px rgba(0,0,0,0.07)" },
    "lg": { "$value": "0 10px 15px rgba(0,0,0,0.10)" }
  }
}
```

### 3.3 `components.json` — registry

A quick-lookup index of all components. The agent reads this first to know what exists, then loads only the specific component file it needs. This keeps context window usage low as the library grows.

```json
{
  "$schema": "rayden-ui/manifest/v1",
  "version": "0.3.0",
  "components": [
    {
      "name": "Button",
      "file": "components/button.json",
      "figmaName": "Button",
      "variants": ["Primary", "Secondary", "Ghost", "Destructive", "Link"],
      "sizes": ["SM", "MD", "LG"],
      "states": ["Default", "Hover", "Focus", "Disabled", "Loading"]
    },
    {
      "name": "Input",
      "file": "components/input.json",
      "figmaName": "Input",
      "variants": ["Text", "Password", "Search", "TextArea"],
      "sizes": ["SM", "MD", "LG"],
      "states": ["Default", "Focus", "Filled", "Disabled", "Error"]
    },
    {
      "name": "Badge",
      "file": "components/badge.json",
      "figmaName": "Badge",
      "variants": ["Neutral", "Brand", "Success", "Warning", "Danger"],
      "sizes": ["SM", "MD"],
      "states": ["Default"]
    },
    {
      "name": "Card",
      "file": "components/card.json",
      "figmaName": "Card",
      "variants": ["Default", "Elevated", "Outlined"],
      "sizes": null,
      "states": ["Default", "Hover"]
    },
    {
      "name": "Avatar",
      "file": "components/avatar.json",
      "figmaName": "Avatar",
      "variants": ["Image", "Initials", "Icon"],
      "sizes": ["XS", "SM", "MD", "LG", "XL"],
      "states": ["Default", "Online", "Offline"]
    }
  ]
}
```

### 3.4 Component anatomy spec

Each component file has three sections: `anatomy` (layer structure), `sizes` (per-size overrides), and `variants` (per-variant and per-state visual overrides). `componentProperties` defines what gets exposed as Figma component properties.

All values reference token aliases. Raw hex or pixel values are only used where no token equivalent exists, and must be accompanied by a `$description` explaining why.

```json
{
  "$schema": "rayden-ui/component/v1",
  "name": "Button",
  "figmaName": "Button",
  "description": "Primary interactive element for user actions",
  "anatomy": {
    "root": {
      "type": "FRAME",
      "layoutMode": "HORIZONTAL",
      "layoutAlign": "CENTER",
      "itemSpacing": "{spacing.2}",
      "paddingHorizontal": "{spacing.4}",
      "paddingVertical": "{spacing.2}",
      "cornerRadius": "{radius.md}",
      "children": ["icon-leading", "label", "icon-trailing"]
    },
    "label": {
      "type": "TEXT",
      "fontFamily": "{typography.fontFamily.sans}",
      "fontWeight": "{typography.fontWeight.semibold}",
      "fontSize": "{typography.fontSize.sm}",
      "lineHeight": "{typography.lineHeight.normal}"
    },
    "icon-leading": {
      "type": "INSTANCE",
      "optional": true,
      "defaultVisible": false,
      "swapProperty": "Icon Leading",
      "size": 16
    },
    "icon-trailing": {
      "type": "INSTANCE",
      "optional": true,
      "defaultVisible": false,
      "swapProperty": "Icon Trailing",
      "size": 16
    }
  },
  "sizes": {
    "SM": {
      "paddingHorizontal": "{spacing.3}",
      "paddingVertical": "{spacing.1}",
      "fontSize": "{typography.fontSize.xs}",
      "iconSize": 14
    },
    "MD": {
      "paddingHorizontal": "{spacing.4}",
      "paddingVertical": "{spacing.2}",
      "fontSize": "{typography.fontSize.sm}",
      "iconSize": 16
    },
    "LG": {
      "paddingHorizontal": "{spacing.6}",
      "paddingVertical": "{spacing.3}",
      "fontSize": "{typography.fontSize.base}",
      "iconSize": 18
    }
  },
  "variants": {
    "Primary": {
      "Default": {
        "root.fill": "{color.primary.500}",
        "label.fill": "{color.neutral.0}"
      },
      "Hover": {
        "root.fill": "{color.primary.600}",
        "label.fill": "{color.neutral.0}"
      },
      "Disabled": {
        "root.fill": "{color.neutral.200}",
        "root.opacity": 0.5,
        "label.fill": "{color.neutral.500}"
      },
      "Loading": {
        "root.fill": "{color.primary.500}",
        "root.opacity": 0.8,
        "label.fill": "{color.neutral.0}",
        "label.text": "Loading..."
      }
    },
    "Secondary": {
      "Default": {
        "root.fill": "{color.neutral.0}",
        "root.stroke": "{color.neutral.200}",
        "root.strokeWidth": 1,
        "label.fill": "{color.neutral.900}"
      },
      "Hover": {
        "root.fill": "{color.neutral.100}",
        "root.stroke": "{color.neutral.200}",
        "label.fill": "{color.neutral.900}"
      },
      "Disabled": {
        "root.fill": "{color.neutral.0}",
        "root.stroke": "{color.neutral.200}",
        "root.opacity": 0.5,
        "label.fill": "{color.neutral.500}"
      }
    },
    "Ghost": {
      "Default": {
        "root.fill": "transparent",
        "label.fill": "{color.neutral.700}"
      },
      "Hover": {
        "root.fill": "{color.neutral.100}",
        "label.fill": "{color.neutral.900}"
      },
      "Disabled": {
        "root.fill": "transparent",
        "root.opacity": 0.5,
        "label.fill": "{color.neutral.500}"
      }
    },
    "Destructive": {
      "Default": {
        "root.fill": "{color.danger.500}",
        "label.fill": "{color.neutral.0}"
      },
      "Hover": {
        "root.fill": "{color.danger.600}",
        "label.fill": "{color.neutral.0}"
      },
      "Disabled": {
        "root.fill": "{color.neutral.200}",
        "root.opacity": 0.5,
        "label.fill": "{color.neutral.500}"
      }
    }
  },
  "componentProperties": [
    { "name": "Variant",           "type": "VARIANT",       "values": ["Primary","Secondary","Ghost","Destructive","Link"], "default": "Primary" },
    { "name": "Size",              "type": "VARIANT",       "values": ["SM","MD","LG"],                                     "default": "MD" },
    { "name": "State",             "type": "VARIANT",       "values": ["Default","Hover","Focus","Disabled","Loading"],     "default": "Default" },
    { "name": "Icon Leading",      "type": "INSTANCE_SWAP", "default": "icon/placeholder" },
    { "name": "Icon Trailing",     "type": "INSTANCE_SWAP", "default": "icon/placeholder" },
    { "name": "Show Icon Leading",  "type": "BOOLEAN",       "default": false },
    { "name": "Show Icon Trailing", "type": "BOOLEAN",       "default": false },
    { "name": "Label",             "type": "TEXT",          "default": "Button" },
    { "name": "Full Width",        "type": "BOOLEAN",       "default": false }
  ]
}
```

### 3.5 Dependencies between components

Some components depend on others. Declare these in a `$relationships` key so the agent loads the full dependency tree before building.

```json
{
  "name": "Select",
  "$relationships": {
    "depends_on": ["Input", "Dropdown", "Badge"]
  }
}
```

---

## 4. Operating Modes

The agent determines which mode to use at the start of every session. Modes are determined by what is available — the agent never hard-fails due to a missing library connection. It always produces output.

| Mode | Trigger | What the agent has | Output quality |
|---|---|---|---|
| **A — Connected** | `search_design_system` returns live library | Live component instances + tokens | Richest — real instances |
| **B — URL** | User pastes Rayna UI Figma URL | `get_design_context` reads specs directly | Full spec fidelity |
| **C — Manifest** | No library, no URL | Manifest JSON only (tokens + anatomy) | Correct naming + tokens, new local components |

### 4.1 Mode resolution sequence

```
1. Call search_design_system("Button") as a probe.
   → Results returned?  → Mode A. Use live library instances.
   → Empty?             → Continue to step 2.

2. Has the user provided a Rayna UI Figma URL?
   → Yes?  → Mode B. Call get_design_context on the file URL.
   → No?   → Ask once:
             "Paste the Rayna UI Figma URL for richer output,
              or type 'skip' to continue from built-in specs."
   → Skip? → Mode C.

3. Mode C: Load manifest/tokens.json + manifest/components.json.
   Proceed. Inform the user:
   "Working from built-in Rayden specs — output will not be
    linked to your Rayna UI library."
```

> **Note:** Mode C is not degraded output. It produces fully token-correct, naming-correct components. The only difference is that it creates new local components rather than inserting instances from a published library. Users can swap to library instances later once the library is connected.

---

## 5. Skill File Specification

The skill file (`SKILL.md`) is a markdown document that teaches the agent how the Rayden design system works. It is not code — it is a structured set of instructions the agent reads at the start of any canvas task.

### 5.1 Skill file structure

| Section | Purpose |
|---|---|
| Frontmatter | `name`, `version`, `description`, compatibility metadata |
| When to use | When to invoke this skill vs. `figma-implement-design` or others |
| Prerequisites | MCP connection check, library probe |
| System conventions | Naming rules, token taxonomy, auto layout rules, component properties |
| Workflow | Ordered 7-step procedure the agent follows |
| Reference files | Pointers to `manifest/` files |
| Example prompts | Canonical prompts users can copy |
| Error handling | What to do when tools fail or return nothing |

### 5.2 Naming convention

All component names in Figma must follow this pattern exactly:

```
ComponentName/Variant/State

Examples:
  Button/Primary/Default
  Button/Primary/Hover
  Button/Destructive/Disabled
  Input/Text/Focus
  Input/Text/Error
  Badge/Success/Default
```

| Rule | Detail |
|---|---|
| Format | `PascalCase/PascalCase/PascalCase` |
| Separator | Forward slash `/` |
| No spaces | Never use spaces in any segment |
| No variant | If no variant applies, use `Default` as the second segment |
| States | `Default`, `Hover`, `Focus`, `Active`, `Disabled`, `Error`, `Loading` |

### 5.3 Auto layout rules

- Every frame must use auto layout — never absolute positioning
- Padding and gap must always reference spacing tokens, never raw pixel values
- Resizing: Hug contents for components; Fill container for full-width layout elements only
- Direction: `HORIZONTAL` for row-based components (buttons, chips); `VERTICAL` for stacked layouts

### 5.4 Component properties

| Property type | What it controls | Example |
|---|---|---|
| `VARIANT` | Visual or structural variants | `Size: SM / MD / LG` |
| `VARIANT` | State | `State: Default / Hover / Disabled` |
| `INSTANCE_SWAP` | Icon slots | `Icon Leading`, `Icon Trailing` |
| `BOOLEAN` | Optional element visibility | `Show Icon Leading` |
| `TEXT` | Editable labels | `Label` |

---

## 6. Distribution

### 6.1 Bundled in the monorepo

For users working inside the Rayden UI monorepo, the skill and manifest are bundled as a package and loaded automatically by Claude Code.

```
rayden-ui/
  packages/
    rayden-ai/
      skills/
        rayden-use/
          SKILL.md
          manifest/
            tokens.json
            components.json
            components/
              button.json
              ...
```

Claude Code users inside the monorepo get the skill automatically. No manual setup required.

### 6.2 Standalone curl install

Users outside the monorepo can install the skill with a single command:

```sh
curl -fsSL https://raydenui.com/install-skill | sh
```

This downloads `SKILL.md` and all manifest files into `~/.claude/skills/rayden-use/` and prints setup instructions. The same manifest files work for Cursor users (placed in `.cursor/rules/`) without modification.

**Install script:**

```sh
#!/bin/sh
set -e

REPO="https://raw.githubusercontent.com/ovalay-studios/rayden-ui/main/skills/rayden-use"
SKILL_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/rayden-use"

mkdir -p "$SKILL_DIR/manifest/components"

echo "Installing Rayden UI Figma skill..."
curl -fsSL "$REPO/SKILL.md"                          -o "$SKILL_DIR/SKILL.md"
curl -fsSL "$REPO/manifest/tokens.json"              -o "$SKILL_DIR/manifest/tokens.json"
curl -fsSL "$REPO/manifest/components.json"          -o "$SKILL_DIR/manifest/components.json"

# Download component specs
for component in button input card badge avatar; do
  curl -fsSL "$REPO/manifest/components/$component.json" \
    -o "$SKILL_DIR/manifest/components/$component.json" 2>/dev/null || true
done

echo ""
echo "✓ Rayden skill installed at $SKILL_DIR"
echo ""
echo "Next:"
echo "  1. Connect Figma MCP:"
echo "     claude mcp add --transport http figma https://mcp.figma.com/mcp"
echo "  2. Restart Claude Code"
echo "  3. Start with: \"Use the rayden-use skill to build a Button component\""
```

### 6.3 Versioning

The skill and manifest are versioned together. The `$schema` field in `components.json` carries the version, and the `SKILL.md` frontmatter declares a `rayden-ui-version` compatibility range.

```sh
# Install a specific version
curl -fsSL https://raw.githubusercontent.com/ovalay-studios/rayden-ui/v1.0.0/skills/rayden-use/SKILL.md

# Always latest
curl -fsSL https://raw.githubusercontent.com/ovalay-studios/rayden-ui/main/skills/rayden-use/SKILL.md
```

### 6.4 Manifest as a build artifact

Once the component library is stable, the manifest should be generated, not hand-maintained. A build script reads the Rayna UI Figma file via the REST API and outputs the JSON files. Every `@raydenui/ui` release triggers a manifest rebuild.

```sh
# Future build pipeline
npm run build:manifest
  → reads Rayna UI Figma file via FIGMA_FILE_KEY
  → extracts tokens via get_variable_defs
  → extracts component anatomy via get_design_context
  → writes manifest/*.json
  → committed to repo as part of release
```

---

## 7. Figma Setup Requirements

| Requirement | How to set up | Required for |
|---|---|---|
| Figma MCP (remote) | `claude mcp add --transport http figma https://mcp.figma.com/mcp` | All modes |
| Figma plugin in Claude Code | `claude plugin install figma@claude-plugins-official` | All modes |
| Rayna UI Figma file published | Assets → Publish as shared library | Mode A only |
| Code Connect | Connect `@raydenui/ui` source paths to Figma nodes | Optional — Dev Mode links |
| Figma seat type | Dev or Full seat on Professional / Org / Enterprise plan | Write-to-canvas access |

> **Beta pricing:** Write-to-canvas (`use_figma`) is currently free during Figma's beta period. It will become usage-based. Figma began enforcing AI credit limits in March 2026 — monitor your team's consumption.

---

## 8. Extending the Manifest

### 8.1 Adding a new component

1. Create `manifest/components/[name].json` following the anatomy spec schema.
2. Add a `$relationships` entry if the component depends on others.
3. Add a registry entry to `manifest/components.json`.
4. Bump the `version` field in `components.json`.
5. Test: prompt Rayden AI to build the component in a test file and validate the output.

### 8.2 Adding or changing tokens

1. Edit `manifest/tokens.json`.
2. Search all component JSON files for usages of the changed token alias.
3. Update references where necessary. Aliases should be stable — avoid renaming.
4. If you must rename a token, add a `$deprecated` key pointing to the replacement:

```json
"primary": {
  "500": {
    "$value": "#2563EB",
    "$deprecated": false
  },
  "brand": {
    "$value": "{color.primary.500}",
    "$deprecated": true,
    "$replacedBy": "color.primary.500",
    "$description": "Renamed to color.primary.500 in v0.4.0"
  }
}
```

### 8.3 Schema versions

The component spec schema is versioned separately from the component library version. If you make a breaking change to the schema, increment the schema version and update `SKILL.md` to handle both versions during the migration window.

| Schema version | Change |
|---|---|
| `v1` | Initial spec: anatomy, sizes, variants, componentProperties |
| `v1.1` | Added `$relationships` for dependency tracking |

---

## 9. Example Prompts

### Component building

```
"Use the rayden-use skill. Add a Ghost variant to the Button component: <figma-url>"

"Create a Tag component — pill shape, sizes SM/MD/LG,
 variants: Neutral, Brand, Success, Warning, Danger"

"Build a full Avatar component set — Image, Initials, and Icon variants, sizes XS through XL"
```

### Code-to-Figma sync

```
"I've added a Tooltip to @raydenui/ui — build the Figma counterpart
 using Rayden tokens and conventions"

"Sync the new Popover component from our codebase to Figma"
```

### Drift detection

```
"Check if the Button in this client file uses Rayden tokens
 or hardcoded values: <figma-url>"

"Audit this file for any components that don't follow Rayden naming: <figma-url>"
```

### Screen composition

```
"Build a Settings page layout using Rayden components —
 sidebar nav, header, content area with form fields"

"Compose a login screen using Rayden Input, Button, and Card components"
```

---

## 10. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `search_design_system` returns nothing | Library not published or not connected to file | Provide Figma URL or skip to Mode C — agent continues from manifest |
| `use_figma` creates wrong token names | Agent guessed token names instead of reading manifest | Ensure `tokens.json` is present; agent loads it before any build |
| Component naming is wrong in output | Agent skipped convention check | Prompt explicitly: `"Follow Rayden naming: ComponentName/Variant/State"` |
| Screenshot shows visual mismatches | Token resolution error or size override missed | Agent should iterate — do not mark complete until screenshot validates |
| Figma write access denied | User on Starter plan or Viewer/Collab seat | Requires Dev or Full seat on a paid Figma plan |
| Skill not found by Claude Code | Installed to wrong directory | Confirm skill is at `~/.claude/skills/rayden-use/SKILL.md` |
| Dependency component missing | `$relationships` not loaded before build | Agent should read `depends_on` array and load all dependency specs first |

---

*Rayden UI · Ovalay Studios · March 2026*
