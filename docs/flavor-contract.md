# Rayden flavor contract

Status: Working specification derived from the agreed product direction; capabilities described here are targets unless already implemented.
Date: 20 September 2026.
Related: [Vision](./vision-and-roadmap.md), [Citrionus brief](./citrionus-product-brief.md).

## Purpose

Allow distinct design identities to share dependable component behavior, while making differences visible to developers, designers, and agents. The first implementation should support Citrionus simply; a second flavor will test whether the abstractions generalize.

This is a logical contract. It does not prescribe new npm package names, repository splits, an inheritance framework, or a configuration file format.

## Shared foundation and permitted differences

| Concern | Shared contract | Permitted flavor variation |
| --- | --- | --- |
| Component identity | Stable logical identity and explicit public export mapping | Additional components declared as flavor-specific |
| Props and events | Consistent meanings, value types, and controlled/uncontrolled behavior for shared components | Explicit extensions; incompatible APIs cannot masquerade as the same supported contract |
| Interaction | Keyboard behavior, focus responsibilities, state semantics, accessible naming requirements | Visual feedback and motion that preserve those responsibilities |
| Tokens | Common semantic roles and defined types | Concrete colors, type scales, spacing, radii, shadows, and motion values |
| Structure | Documented composition requirements | Internal markup and visual arrangement may differ where public behavior and accessibility remain intact |
| Recipes and blocks | Accurate dependencies and checked usage | Distinct compositions, density, layout, and visual hierarchy |
| Documentation and AI | Accurate names, version context, support status, and errors | Flavor-specific guidance, examples, and design intent |
| Figma | Mapping to a supported component contract | Layers and variant representations appropriate to the flavor |

Flavor, mode, and customization are separate concepts. Citrionus is a flavor; light/dark is a mode; a supported brand accent override is customization. Projects should not need a new flavor for each mode or brand value.

## Flavor identity and capability record

Every supported flavor release should expose the following information. These are required concepts, not finalized serialized field names.

- Stable flavor identifier and display name. Proposed initial identifier: `citrionus`; display name: Citrionus.
- Flavor release version and supported shared-contract version or range.
- Compatible UI package releases and AI-data schema version.
- Available modes and supported customization surfaces.
- Component capabilities: logical identity, export name, import path, support status, and applicable contract version.
- Whether an entry is a component family, a directly importable component, or a required subcomponent.
- Available recipes, their component dependencies, and flavor/version applicability.
- Figma specification availability and its compatibility information, where provided.
- Explicit limitations, deprecations, and migration guidance.

UI package version, flavor version, AI package version, and metadata schema version are different concepts. They may initially move together, but compatibility must be declared rather than inferred from equal version numbers.

## Component discovery and naming

Use a canonical catalog to connect product-facing names to real exports. A family such as a chart or activity-feed group need not itself be an importable component. Discovery must make that distinction clear and provide the supported export names.

Lookup order:

1. Resolve an exact supported export or canonical component identity for the selected flavor and version.
2. Resolve a documented, unambiguous alias within that same scope.
3. Return an explicit unsupported, unavailable, ambiguous, or unknown result with relevant alternatives.

A real component name takes precedence over an alias. An alias must not redirect an existing Spinner to a different component. Derive unsupported status from the selected capability record; separately authored exclusion lists must never override supported entries.

Switching to another flavor does not silently substitute a missing component. Report the difference and provide a migration option.

## Flavor and version resolution

Project configuration and installed dependencies are evidence about the current project. Their relationship must be checked for consistency. An explicit request to explore another flavor is a target for guidance or migration, not proof that the project already uses it.

- With supported project context, use the configured flavor and verified compatible installed release.
- With conflicting configuration and installed packages, report the mismatch before generating version-dependent code.
- In a new-project flow with no flavor selection, default to Citrionus and state the assumption.
- With unknown context, return explicitly scoped reference information and identify what was assumed. Do not claim to have inspected a project without access to it.
- With an unsupported version, explain the compatibility limit and offer documented migration or version selection; do not silently use the latest data.

MCP responses should carry the resolved flavor, relevant versions, and any assumptions. An MCP server may need explicit context from its client rather than filesystem access.

## Authoritative definitions

| Information | Authority | Derived or checked surfaces |
| --- | --- | --- |
| Export names and prop types | Public component source and exported types | Catalog export mappings, manifests, documentation examples |
| Runtime defaults and behavior | Implemented component behavior and meaningful tests | Manifest defaults, interaction guidance, recipes |
| Token roles and types | A maintained semantic token specification | Flavor values, CSS/preset outputs, AI token data, Figma mappings |
| Flavor values | One maintained token definition per flavor | Generated or checked token outputs |
| Design intent and composition guidance | Explicitly authored flavor guidance | Recipes, examples, agent instructions, design documentation |
| Figma anatomy | Versioned design specifications mapped to component contracts | Design-building instructions and parity checks |
| Compatibility | Release metadata and verified compatibility checks | MCP context, documentation, starter configuration |

For Citrionus, existing source, CSS, and token data must be reconciled before introducing a replacement token pipeline. Avoid maintaining two competing authorities during migration. Types alone cannot establish runtime defaults or accessibility behavior.

## Validation contract

Validation reports errors, warnings, and limitations separately. It must not represent an unchecked condition as a passed check.

Check supported component identity, applicable flavor/version, required props, known prop types and enum values, and composition constraints where statically assessable. Account for inherited platform attributes such as valid HTML, ARIA, and data attributes rather than rejecting everything absent from a small manifest.

Unknown components and definitively invalid required values are errors. Deprecated aliases and advisory guidance may be warnings. Dynamic expressions and runtime-dependent behavior can be reported as not assessed. Required children are checked according to the actual component contract, not a universal nesting rule.

Validation of a snippet is not proof of accessibility or application correctness. State exactly what was checked and which checks remain.

## Compatibility and change rules

- Shared supported component props retain their semantics across compatible flavors.
- Adding a capability does not imply that older releases support it.
- Removing an export, changing an event's meaning, or tightening required props requires a breaking compatibility declaration and migration guidance.
- Visual changes can require release notes and review even when application logic remains compatible.
- Consumers customizing internal selectors, exact dimensions, or undocumented markup are outside guaranteed flavor interchangeability.
- Flavor-specific additions are explicitly marked and cannot be required by a supposedly portable recipe without disclosure.

## Practical sequence

First, establish an accurate Citrionus catalog and release context while preserving existing public imports. Next, define semantic roles and compatibility metadata only to the depth required by real consumers. Finally, test the contract with a second flavor that differs in more than color.

The second-flavor evaluation must cover stateful controls, forms, navigation, overlays, tables, modes, and representative layouts. Document migration differences. Defer broad architectural extraction until that evidence justifies it.
