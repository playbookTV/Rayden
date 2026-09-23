---
name: rayden-use
description: Build or review Rayden UI component designs in Figma using the packaged Citrionus anatomy and token references. Use for Rayden code-to-design work, not implementing an existing Figma design as application code.
metadata:
  version: "1.1.0"
  author: Ovalay Studios
---

# Rayden Figma skill

Use the bundled Citrionus reference data to build or review local Figma components. Rayden AI supplies knowledge; it does not supply a Figma connection or permission to edit a file.

Confirm the target file and use the available Figma tool's own setup, access checks, and required skill instructions. Do not assume a particular MCP tool prefix, subscription plan, or connected library. Work within the user's requested component and file scope.

## Load the matching reference

Paths below are relative to the installed `@raydenui/ai` package root, two directories above this skill:

- `dist/manifests/components.json`: canonical catalog, exact export names, reference versions, and capabilities.
- `dist/anatomy/components.json`: Figma anatomy registry.
- `dist/anatomy/components/<slug>.json`: the selected component's anatomy.
- `dist/tokens/tokens.dtcg.json`: generated design-token values.

Read only the anatomy and references relevant to the requested work. The same data is available programmatically through `@raydenui/ai/anatomy` and the canonical guidance APIs.

Check the catalog's UI release and flavor against the intended implementation. Figma property labels and visibility switches are design controls; they are not automatically React props. Read `implementationNotes` in an anatomy specification before translating its variants. `ActivityFeed` is a family, not a runtime export; its React components are `ActivityItem` and `ActivityContent`.

## Build and verify

1. Resolve the selected anatomy's token references. A missing reference is an unresolved design dependency; report it instead of silently substituting a different color, size, or font.
2. Select the variants requested by the user and supported by the current component. Do not generate every combination by default or invent universal Variant/Size/State props.
3. Use the target tool's documented Figma APIs. Preserve editable text and useful layout relationships. Auto layout is appropriate for normal flow; overlays and intentionally positioned elements may require absolute positioning.
4. Load the declared font before creating or changing text. If unavailable, report the mismatch and use an explicitly agreed substitute rather than claiming font parity.
5. Inspect the resulting design and its structure. Verify the selected variants, typography, spacing, token values, and component property bindings. Do not describe reference-based output as proven runtime parity without comparing the actual rendered UI.

Anatomy is authored reference material. Token resolution is checked in the package pipeline, but dark-mode parity, every interaction, and complete Figma/runtime visual equivalence are not certified by that check. Use runtime props and behavior as authority when a legacy anatomy suggestion conflicts with the implementation.

## Focused references

- [Naming conventions](../../references/naming-conventions.md): component and variant naming patterns; adapt to the component's real property set.
- [Token usage](../../references/token-usage.md): token resolution and mapping.
- [Layout rules](../../references/layout-rules.md): layout patterns; use only those appropriate to the requested component.
- [Component properties](../../references/component-properties.md): Figma property mechanics, not a mandatory list of props for every component.

If access or tools are unavailable, explain the specific missing capability. Do not install integrations, modify unrelated files, or imply that Rayden's MCP server itself can write to Figma.
