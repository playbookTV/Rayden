# Rayden UI Expansion: Flavours, Motion System & Agent-Native Distribution

**Implementation brief for Codex / engineering**  
**Version:** 1.0  
**Date:** 20 September 2026  
**Status:** Proposed architecture and phased implementation plan

---

## 1. Executive summary

Rayden UI should evolve from an open-source React component library into a more opinionated, configurable UI system with three complementary layers:

1. **Flavours** — coherent visual personalities that change the design grammar of the library without forking component implementations.
2. **Rayden Motion** — a semantic motion system made of tokens, presets, behaviours, recipes and reusable animated primitives.
3. **Agent-native distribution** — every component, flavour, motion recipe and block should be discoverable and installable by humans and coding agents through a registry, natural-language prompts and machine-readable metadata.

The primary architectural rule is that these systems must remain **orthogonal but composable**. A visual flavour should not hard-code one motion personality; themes should not be treated as flavours; components should not fork into separate implementations for each aesthetic; and the website must not become the only way to consume Rayden.

The target experience is closer to a **UI styling and interaction engine** than a traditional component kit:

```tsx
<RaydenProvider
  flavour="veyra"
  appearance="dark"
  accent="plum"
  density="comfortable"
  motion="calm"
>
  <App />
</RaydenProvider>
```

The same Button, Tabs, Dialog and Card APIs should remain valid across combinations such as:

- Veyra + Light + Plum + Calm
- Gravion + Dark + Lime + Snappy
- Noctis + Light + Neutral + Reduced
- Neo + Dark + Orange + Playful

A developer should be able to install or apply these through code, CLI or a prompt to an agent.

---

## 2. Why this expansion exists

Rayden does not need to win by having the largest component count. The current component ecosystem is saturated with libraries offering accessible Buttons, Dialogs and Cards. The more interesting 2026 shift is happening in four areas:

- **Code ownership and registries:** developers increasingly copy component source into their project rather than depend on a monolithic runtime package.
- **Agent-native access:** registries can now be searched and installed through AI coding agents.
- **Taste as a system:** visual identity is increasingly packaged through themes, tokens and presets rather than isolated component variants.
- **Interaction quality:** motion libraries are moving away from random effects toward reusable primitives, recipes and tunable motion parameters.

Rayden should use these trends without becoming a clone of shadcn, 21st, Animate UI, SmoothUI or UI Beats. The distinctive proposition should be:

> **One component system, multiple coherent visual personalities, a first-class motion grammar, and an interface designed equally for humans and coding agents.**

---

## 3. Product principles

### 3.1 One anatomy, many personalities

A flavour must not create a second Button implementation. The Button anatomy, semantics, accessibility and prop contract should remain stable. Flavours should alter token resolution and, only where necessary, controlled style recipes.

Bad:

```tsx
<SoftButton />
<SharpButton />
<NeoButton />
```

Preferred:

```tsx
<Button />
```

with context:

```tsx
<RaydenProvider flavour="gravion">
  <Button>Save</Button>
</RaydenProvider>
```

### 3.2 Semantic tokens over magic numbers

Components should consume semantic design and motion tokens. Avoid scattering `8px`, `180ms`, spring stiffness values or bespoke cubic-bezier curves through component files.

Bad:

```tsx
transition={{ duration: 0.18 }}
```

Preferred:

```tsx
transition={motion.transition('interactive')}
```

or a CSS-token equivalent where CSS is sufficient.

### 3.3 Cheapest capable animation engine

Do not use Motion simply because Motion exists. Use the smallest mechanism that satisfies the behaviour:

- CSS transitions/animations for simple state changes.
- Web Animations API for imperative timelines where useful.
- Motion for layout animation, gestures, springs, presence and shared layout.
- GSAP only for advanced choreography that clearly justifies the dependency.
- WebGL/canvas only for specialised visual effects.

### 3.4 Accessibility survives every flavour and motion preset

Flavours must not change semantic markup or remove focus visibility. Motion must respect `prefers-reduced-motion`. Contrast and interactive state requirements remain non-negotiable.

### 3.5 Visual flavour and motion personality remain separable

A Gravion UI might use Calm motion. A Veyra UI might use Snappy motion. Defaults may be recommended, but users must be able to override them.

### 3.6 Human-readable and machine-readable are equally important

The docs page is not the product boundary. Rayden should expose structured metadata for components, dependencies, props, composition hints, flavour compatibility and motion behaviours.

---

## 4. Competitive patterns worth adopting

This section is not a request to duplicate these products. It identifies useful patterns to absorb.

### 4.1 shadcn registry + MCP

Current shadcn tooling supports custom registries and an MCP server that can browse, search and install items from any shadcn-compatible registry. Registries are configured in `components.json`, and the same model supports components, hooks, pages, config and rules.

**Implication for Rayden:** prioritise a shadcn-compatible registry before building a custom MCP server. This gives Rayden an agent path with substantially less infrastructure.

### 4.2 21st

21st treats component acquisition as an AI workflow. Components can ship as prompts, and its agent tooling can search a catalogue, install components, generate variants, review UI and publish components/themes.

**Pattern to adopt:** a “Copy prompt” action should contain enough implementation context that Codex, Claude Code, Cursor or another agent can install/adapt a Rayden item without the user manually collecting dependencies and usage notes.

### 4.3 SmoothUI

SmoothUI exposes agent-friendly discovery through MCP, REST APIs, machine-readable catalogues, source retrieval, dependency information and `llms.txt`-style resources.

**Pattern to adopt:** structured metadata should be generated from the same source of truth as human docs. Avoid manually maintaining separate agent documentation.

### 4.4 UI Beats

UI Beats combines agent-aware component access with tunable props and a Motion Studio for spring/easing experimentation.

**Pattern to adopt:** motion values should be visualised and editable. Motion is easier to understand when users can tune a spring or curve and immediately see the result.

### 4.5 Animate UI and Motion Primitives

These systems treat animation as reusable building blocks rather than only decorative finished components.

**Pattern to adopt:** build reusable behaviours/primitives such as Presence, Reveal, Collapse, Shared Layout and Number Transition, then compose components from them.

---

# PART I — FLAVOURS

## 5. Definition of a Rayden Flavour

A **Flavour** is a coherent set of visual design decisions applied globally or within a subtree. It is not a colour theme.

A flavour can influence:

- radius language
- border thickness/style
- surface treatment
- elevation/shadows
- component proportions
- typography weight/tracking/hierarchy treatment
- control shape
- state treatment
- selected/active indicators
- decorative density
- default motion recommendation, but not mandatory motion behaviour

A flavour should **not** own:

- brand accent colour
- light/dark appearance
- content density as a hard-coded constraint
- accessibility rules
- component semantics

This distinction matters because a user should be able to combine a flavour with multiple appearances and accents.

---

## 6. Canonical flavour set

Rayden begins with five named flavours. These names are the public product vocabulary and should be used consistently in the API, documentation, registry metadata and prompt-generation layer. Plain-English archetypes may appear as supporting descriptions, but should not replace the canonical names.

The first implementation pass should prove the architecture with Citrionus, Veyra and Gravion. Noctis and Aetherium should then be added on the same token model rather than through component forks.

### 6.1 Citrionus

**Archetype:** Default / balanced / orange-native.

Purpose: the reference Rayden personality and the closest continuation of the current library.

Characteristics:
- Rayden's signature orange identity
- moderate radius
- restrained elevation
- conventional control proportions
- balanced border/surface contrast
- minimal decorative styling
- broad compatibility

Citrionus is the baseline against which every other flavour is evaluated. Existing Rayden consumers should land here by default unless they explicitly choose another flavour.

### 6.2 Veyra

**Archetype:** Soft / friendly / expressive.

Purpose: warmer, more relaxed product surfaces without becoming cartoonishly rounded.

Characteristics:
- larger radii
- softer contrast between surfaces
- low-intensity shadow/elevation
- slightly more generous internal spacing
- rounded selection indicators
- gentle hover and press treatment

Avoid “everything has 24px radius” syndrome. Veyra should still preserve hierarchy between controls, cards and containers.

### 6.3 Gravion

**Archetype:** Sharp / bold / weighty.

Purpose: dense, precise interfaces with stronger structural presence, suitable for tooling, fintech and high-information products.

Characteristics:
- small radius
- clearer and, where appropriate, heavier borders
- reduced elevation
- tighter visual geometry
- stronger selected-state delineation
- slightly denser controls by default
- deliberately grounded, graphic surfaces

Gravion should feel engineered and substantial, not simply “Citrionus with square corners.”

### 6.4 Noctis

**Archetype:** Mono / minimal / high-contrast.

Purpose: a typography-led, low-decoration flavour for interfaces that need restraint and clarity.

Characteristics:
- grayscale-biased surfaces
- strong typographic hierarchy
- minimal decorative colour beyond semantic/accent needs
- restrained or absent elevation
- crisp separators and focus treatment
- reduced visual noise

Noctis is not synonymous with dark mode. It must work in both light and dark appearance while retaining its monochromatic grammar.

### 6.5 Aetherium

**Archetype:** Glass / luminous / atmospheric.

Purpose: layered, translucent interfaces with controlled depth and light.

Characteristics:
- translucent or semi-translucent surfaces
- restrained backdrop blur
- luminous edge/border treatment
- layered depth rather than heavy drop shadows
- careful contrast management
- subtle atmospheric state transitions

Aetherium must remain usable and performant. Glass effects are a treatment, not an excuse to compromise text contrast, focus visibility or reduced-transparency fallbacks.

### 6.6 Future flavour candidates

Only after the canonical five are stable:

- **Editorial:** stronger typographic hierarchy and whitespace.
- **Terminal:** technical density, monospace accents, status-forward.
- **Play:** expressive shape/state treatment.
- **Neo:** bold border, offset shadow, intentionally graphic, if this cannot be expressed convincingly as a Gravion extension.

These are expansion candidates, not current scope.

---
## 7. Flavour token architecture

Use a layered token pipeline:

```text
Primitive tokens
    ↓
Semantic foundation tokens
    ↓
Flavour tokens
    ↓
Theme/appearance tokens
    ↓
Component semantic tokens
    ↓
Component styles
```

Suggested division:

### 7.1 Primitive tokens

Raw scales only. Components should rarely consume these directly.

```css
--r-space-1
--r-space-2
--r-space-3
--r-radius-1
--r-radius-2
--r-radius-3
--r-shadow-1
--r-shadow-2
--r-font-weight-medium
```

### 7.2 Semantic foundation tokens

```css
--r-surface
--r-surface-raised
--r-border
--r-border-strong
--r-text
--r-text-muted
--r-focus-ring
--r-control-height
--r-control-radius
--r-container-radius
```

### 7.3 Flavour tokens

Flavour tokens should express design grammar rather than component names where possible.

```css
--r-shape-control-radius
--r-shape-container-radius
--r-shape-pill-radius
--r-border-default-width
--r-border-emphasis-width
--r-elevation-control
--r-elevation-container
--r-surface-contrast
--r-type-control-weight
--r-type-label-tracking
--r-state-hover-lift
--r-state-press-scale
```

### 7.4 Component semantic tokens

Components map their needs to the grammar:

```css
--r-button-radius: var(--r-shape-control-radius);
--r-button-border-width: var(--r-border-default-width);
--r-card-radius: var(--r-shape-container-radius);
--r-tabs-indicator-radius: var(--r-shape-pill-radius);
```

This isolates component implementation from each flavour.

---

## 8. CSS/provider model

Proposed public API:

```tsx
<RaydenProvider
  flavour="veyra"
  appearance="system"
  accent="plum"
  density="default"
  motion="calm"
>
  {children}
</RaydenProvider>
```

Expected DOM:

```html
<html
  data-rayden-flavour="veyra"
  data-rayden-appearance="dark"
  data-rayden-density="default"
  data-rayden-motion="calm"
>
```

Token declarations:

```css
[data-rayden-flavour='veyra'] {
  --r-shape-control-radius: 0.75rem;
  --r-shape-container-radius: 1rem;
  --r-border-default-width: 1px;
  --r-elevation-control: var(--r-shadow-soft-1);
  --r-elevation-container: var(--r-shadow-soft-2);
  --r-type-control-weight: 550;
}

[data-rayden-flavour='gravion'] {
  --r-shape-control-radius: 0.25rem;
  --r-shape-container-radius: 0.375rem;
  --r-border-default-width: 1px;
  --r-elevation-control: none;
  --r-elevation-container: none;
  --r-type-control-weight: 600;
}
```

Keep specificity low. Prefer data attributes and CSS custom properties over generated per-component class trees.

---

## 9. Nested geometry

Rayden should handle nested radii coherently. A Card with an inset media panel or action region should not produce visually arbitrary corners.

Possible approach:

```css
--r-card-radius: 16px;
--r-card-padding: 12px;
--r-card-inner-radius: max(4px, calc(var(--r-card-radius) - var(--r-card-padding)));
```

This is useful for cards, nested panels, menus, segmented controls and dialog content.

Codex should create a small geometry utility layer and document where it is safe to use. Do not blindly calculate every inner radius if it harms the design.

---

## 10. Component migration strategy for flavours

Do not rewrite the entire library in one pass.

Order:

1. Button
2. Input
3. Card
4. Tabs
5. Dialog
6. Select / Dropdown Menu
7. Checkbox / Radio / Switch
8. Tooltip / Popover
9. Toast
10. remaining components

For each component:

- inventory current hard-coded values
- classify values as primitive, semantic, component-specific or intentional exception
- replace appropriate values with tokens
- verify all five canonical flavours where coverage exists
- verify light/dark
- verify keyboard/focus states
- verify reduced motion where applicable
- add visual examples to docs

A tokenisation PR should not casually change the public prop API.

---

# PART II — RAYDEN MOTION

## 11. Motion system goals

Rayden Motion should make animation:

- consistent
- semantic
- tuneable
- composable
- accessible
- cheap to adopt
- independent from a single visual flavour

The system should provide three levels:

1. **Tokens:** duration, curve, spring, distance and reduced-motion policy.
2. **Behaviours/primitives:** reusable implementation patterns.
3. **Recipes:** named combinations suitable for components and product patterns.

---

## 12. Motion token taxonomy

### 12.1 Tempo

Avoid exposing arbitrary durations as the primary API.

```ts
motion.duration.instant
motion.duration.fast
motion.duration.normal
motion.duration.slow
motion.duration.deliberate
```

Example initial values, subject to tuning:

```ts
instant: 0
fast: 100
normal: 180
slow: 260
deliberate: 400
```

### 12.2 Curves

```ts
motion.ease.standard
motion.ease.enter
motion.ease.exit
motion.ease.emphasized
motion.ease.linear
```

### 12.3 Springs

```ts
motion.spring.snappy
motion.spring.calm
motion.spring.elastic
motion.spring.playful
```

Each spring is a tested configuration, not a vibes-only name.

Example schema:

```ts
export type SpringPreset = {
  type: 'spring'
  stiffness: number
  damping: number
  mass: number
  restDelta?: number
  restSpeed?: number
}
```

### 12.4 Distance

```ts
motion.distance.micro
motion.distance.short
motion.distance.medium
motion.distance.large
```

Distance should be used for reveal/slide behaviours rather than hard-coded per component.

### 12.5 Scale

```ts
motion.scale.press
motion.scale.enter
motion.scale.emphasized
```

### 12.6 Stagger

```ts
motion.stagger.tight
motion.stagger.normal
motion.stagger.relaxed
```

---

## 13. Motion presets

Initial global presets:

### 13.1 Calm

- restrained distance
- moderate durations
- low/no overshoot
- subtle press response
- suitable for productivity and dense applications

### 13.2 Snappy

- short durations
- micro distances
- low-latency state changes
- crisp press/selection feedback

### 13.3 Playful

- more spring character
- controlled overshoot
- slightly larger distance and scale response
- never at the expense of legibility or task completion

### 13.4 Reduced

- removes non-essential transforms and choreography
- preserves critical state communication
- should be automatically selected/modified when `prefers-reduced-motion: reduce` applies, unless a specific animation is essential and accessibility-safe

---

## 14. Motion behaviours / primitives

Create primitives before building a catalogue of animated finished components.

Candidate primitives:

### Presence
Enter/exit orchestration.

### Reveal
Fade/translate/scale reveal with semantic presets.

### Collapse
Height/opacity animation for Accordion, Collapsible and disclosure patterns.

### SharedLayout
Animated geometry transfer between selected states. Primary use: Tabs, Segmented Control, navigation indicators.

### Stagger
Children sequence with semantic intervals.

### NumberTransition
Animated number/value changes for counters, metrics and price changes.

### Swap
Transition between pieces of content while maintaining container stability.

### Morph
Shape/layout morph where appropriate.

### Pressable
Standardised hover/press/focus motion for interactive controls.

### FollowPointer
Optional pointer-follow primitive for expressive surfaces.

### Magnetic
Optional magnetic attraction behaviour for decorative/high-expression contexts. Not a default control behaviour.

### InView
Viewport-triggered animation for marketing/documentation surfaces.

Every primitive must define:

- intended use
- non-use cases
- default preset
- reduced-motion behaviour
- keyboard implications if interactive
- whether CSS or Motion is used
- performance notes

---

## 15. Motion recipes

Recipes are reusable combinations of primitives and tokens.

Examples:

- `appear.fade`
- `appear.fadeUp`
- `appear.scale`
- `selection.slideIndicator`
- `selection.sharedPill`
- `content.crossfade`
- `content.slideSwap`
- `overlay.pop`
- `overlay.sheet`
- `feedback.press`
- `feedback.success`
- `feedback.shake` (use sparingly and with accessibility caution)
- `list.staggerIn`
- `number.count`

Public API could look like:

```tsx
<MotionReveal recipe="appear.fadeUp">
  <Card />
</MotionReveal>
```

or internally:

```ts
const transition = getMotionRecipe('selection.sharedPill', motionPreset)
```

Avoid forcing consumers to learn raw stiffness/damping values for normal use.

---

## 16. Motion and flavours

Flavours can have a **recommended default motion preset**, but should not own motion values.

Suggested defaults:

```ts
const flavourDefaults = {
  citrionus: { motion: 'snappy' },
  veyra: { motion: 'calm' },
  gravion: { motion: 'snappy' },
}
```

Users can override:

```tsx
<RaydenProvider flavour="gravion" motion="calm">
```

This prevents visual and kinetic design from becoming inseparable.

---

## 17. Motion engine strategy

Create an adapter layer so components do not depend directly on arbitrary Motion configuration everywhere.

Suggested structure:

```text
packages/
  motion/
    tokens.ts
    presets.ts
    recipes.ts
    reduced-motion.ts
    adapters/
      css.ts
      motion.ts
    primitives/
      reveal.tsx
      collapse.tsx
      shared-layout.tsx
      pressable.tsx
```

If Rayden currently uses Motion directly in components, migrate gradually behind helper functions/primitives rather than introducing a giant refactor.

---

## 18. Motion Studio

A later, but strategically valuable, documentation feature.

Minimum controls:

- speed
- bounce
- distance
- easing/spring selection

Presets:

- Calm
- Snappy
- Elastic
- Playful
- Mechanical
- Dramatic

Output options:

- Copy token values
- Copy Motion transition
- Copy Rayden preset/recipe usage
- Copy prompt for agent

Example generated prompt:

```text
Apply Rayden's shared-layout selection recipe to the existing Tabs component.
Use the Snappy motion preset.
Preserve the current Rayden flavour, props and accessibility behaviour.
Respect prefers-reduced-motion.
Do not add a second animation dependency.
```

Do not build Motion Studio before the underlying token/recipe API stabilises.

---

# PART III — AGENT-NATIVE RAYDEN

## 19. Core principle

The website should become one interface to Rayden, not the only interface.

Target consumption paths:

```text
Human
  ├── browse docs
  ├── copy code
  ├── copy CLI command
  └── copy prompt

Agent
  ├── inspect registry
  ├── search metadata
  ├── install item
  ├── inspect source/props
  └── compose with project context
```

---

## 20. Shadcn-compatible registry

This should be the first agent-distribution milestone.

A current shadcn registry can distribute code beyond components, including hooks, pages, config and rules. A compatible registry can be consumed by shadcn's MCP tooling.

Proposed registry structure:

```text
registry.json
registry/
  components/
    button.json
    card.json
    tabs.json
  motion/
    reveal.json
    collapse.json
    shared-layout.json
  flavours/
    flavour-veyra.json
    flavour-gravion.json
  blocks/
  rules/
    rayden-conventions.json
```

Example conceptual registry item:

```json
{
  "name": "animated-tabs",
  "type": "registry:ui",
  "title": "Animated Tabs",
  "description": "Rayden Tabs with a shared-layout active indicator.",
  "dependencies": ["motion"],
  "registryDependencies": ["tabs", "motion-tokens"],
  "files": [
    {
      "path": "components/rayden/animated-tabs.tsx",
      "type": "registry:component"
    }
  ]
}
```

Codex should validate registry output against current shadcn schemas rather than relying on this illustrative JSON verbatim.

---

## 21. components.json namespace

Document a Rayden namespace pattern, for example:

```json
{
  "registries": {
    "@rayden": "https://rayden-ui.dev/r/{name}.json"
  }
}
```

Then users/agents can request Rayden-specific items without name collisions.

---

## 22. Copy Prompt

Every suitable component page should expose:

1. Copy code
2. Copy install command
3. Copy prompt
4. Optional “Use with agent” setup guidance

The prompt should not simply say “add this component.” It should contain structured implementation intent.

Example:

```text
Install and use the Rayden Animated Tabs component from the Rayden registry.

Requirements:
- Use the existing project theme and accent tokens.
- Preserve the current Rayden flavour.
- Use the `sharedPill` selection motion recipe.
- Use the project's current motion preset unless none is configured; otherwise use `snappy`.
- Respect prefers-reduced-motion.
- Do not replace existing routing or state logic.
- Do not add duplicate UI or animation libraries.
- Keep the component source editable in this repository.

After installation:
1. Replace the existing settings navigation tabs with the Rayden component.
2. Preserve labels, active state and keyboard behaviour.
3. Run the relevant typecheck/tests.
```

Prompt generation should derive from component metadata wherever possible.

---

## 23. Machine-readable component metadata

Create a canonical metadata schema.

Suggested fields:

```ts
interface RaydenRegistryMetadata {
  name: string
  title: string
  description: string
  category: string[]
  tags: string[]
  status: 'stable' | 'beta' | 'experimental'
  dependencies: string[]
  registryDependencies: string[]
  primitive?: string
  propsSummary?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  accessibility: {
    keyboard?: string[]
    reducedMotion?: string
    notes?: string[]
  }
  flavours: {
    supported: string[] | 'all'
    default?: string
  }
  motion: {
    supported: boolean
    recipes?: string[]
    defaultPreset?: string
  }
  compositionHints?: string[]
  avoidWhen?: string[]
  examples?: string[]
}
```

This metadata can power:

- docs pages
- registry descriptions
- prompt generation
- search
- MCP discovery
- future `llms.txt`
- future REST/search API

Do not manually duplicate it in multiple places.

---

## 24. Agent rules / conventions item

Rayden should publish an installable conventions/rules item that tells coding agents how to use Rayden correctly.

Content should include rules such as:

- Prefer existing Rayden components over recreating equivalents.
- Preserve semantic HTML and accessibility.
- Do not inline arbitrary colours if Rayden tokens exist.
- Use semantic motion presets/recipes rather than hard-coded transition values.
- Respect the active flavour rather than applying local radius/shadow overrides.
- Use the existing animation engine unless a recipe explicitly requires another one.
- Do not add a second component primitive library for a capability Rayden already provides.
- Preserve `prefers-reduced-motion` handling.
- Keep installed component source editable.

A rules item is a high-leverage way to reduce agent drift.

---

## 25. llms.txt and structured catalogues

After the registry exists, add machine-readable discovery endpoints.

Recommended:

```text
/llms.txt
/llms-full.txt
/api/components.json
/api/motion.json
/api/flavours.json
```

`llms.txt` should be concise: identity, installation, registry namespace, component index, key conventions.

`llms-full.txt` can include richer props, composition hints and recipes.

These are secondary to a correct registry, not a substitute for it.

---

## 26. Custom Rayden MCP: defer initially

Do **not** begin by building a bespoke MCP server.

First prove:

- registry compatibility
- useful metadata
- high-quality descriptions
- dependency resolution
- prompt generation
- successful installs through Codex/Claude/Cursor via shadcn MCP

Only build a custom Rayden MCP if Rayden later needs capabilities the generic shadcn MCP cannot provide, such as:

- semantic search over motion behaviours
- flavour-aware recommendations
- live theme inspection
- “apply this motion recipe to an existing local component” tooling
- automated audits against Rayden conventions

This avoids unnecessary infrastructure.

---

# PART IV — DOCUMENTATION EXPERIENCE

## 27. Revised information architecture

Suggested top-level docs:

```text
Getting Started
Components
Blocks
Flavours
Motion
  Overview
  Tokens
  Presets
  Primitives
  Recipes
  Motion Studio
Themes
Agent / AI
  Copy Prompt
  Registry
  MCP Setup
  Codex
  Claude Code
  Cursor
Changelog
```

Do not create empty sections just to match the eventual architecture. Ship sections as capabilities land.

---

## 28. Component page anatomy

Each component page should eventually include:

- live preview
- flavour switcher
- appearance switcher
- motion preset switcher when relevant
- props
- accessibility notes
- code example
- install command
- copy prompt
- dependencies
- related motion recipes
- related components
- status badge

Avoid drowning simple components in controls. Only show motion controls when the component actually has meaningful motion behaviour.

---

## 29. Flavour playground

Build after at least 6–10 representative components are tokenised.

Recommended controls:

```text
Flavour     Citrionus | Veyra | Gravion | Noctis | Aetherium
Appearance  Light | Dark | System
Accent      Plum | Lime | Blue | Neutral | Custom
Density     Compact | Default | Comfortable
Motion      Calm | Snappy | Playful | Reduced
```

Preview should include a representative mini application surface, not only isolated buttons. Include:

- navigation/tabs
- form controls
- card
- dialog trigger
- status/badge
- list row
- selected/hover/focus states

The point is to reveal whether a flavour forms a coherent visual system.

---

## 30. Motion playground

Once motion recipes exist, provide a surface that can compare presets on the same behaviour.

Example:

```text
Behaviour: Shared Tab Indicator
Preset:    Snappy
Speed:     [----●---]
Bounce:    [--●-----]
Distance:  [---●----]
```

Output should reference semantic APIs first and raw values second.

Preferred:

```tsx
<Tabs motion="snappy" />
```

Advanced:

```tsx
<Tabs
  transition={{
    type: 'spring',
    stiffness: 380,
    damping: 30
  }}
/>
```

---

# PART V — ENGINEERING PLAN

## 31. Proposed package structure

Adapt to the current repo rather than forcing this exact monorepo layout.

```text
packages/
  ui/
    components/
    provider/
    styles/
  tokens/
    primitives/
    semantic/
    flavours/
    themes/
    density/
  motion/
    tokens/
    presets/
    recipes/
    primitives/
    adapters/
  registry/
    registry.json
    items/
  metadata/
    components/
    motion/
    flavours/
apps/
  docs/
```

If Rayden is not currently a monorepo, Codex should prefer incremental folders/packages over a disruptive restructuring PR.

---

## 32. TypeScript types

Suggested core types:

```ts
export type RaydenFlavour = 'citrionus' | 'veyra' | 'gravion' | 'noctis' | 'aetherium'
export type RaydenAppearance = 'light' | 'dark' | 'system'
export type RaydenDensity = 'compact' | 'default' | 'comfortable'
export type RaydenMotionPreset = 'calm' | 'snappy' | 'playful' | 'reduced'

export interface RaydenProviderProps {
  flavour?: RaydenFlavour
  appearance?: RaydenAppearance
  density?: RaydenDensity
  motion?: RaydenMotionPreset
  accent?: string
  children: React.ReactNode
}
```

Do not make `accent` a free-form string if the current theming architecture already has a safer token/palette type. Integrate rather than duplicate.

---

## 33. Provider responsibilities

`RaydenProvider` should:

- establish flavour context/data attributes
- establish motion preset context/data attributes
- integrate with existing theme/appearance mechanism
- expose hooks only where runtime JS is required
- avoid unnecessary rerenders for styling-only values
- support nested overrides where reasonable
- preserve SSR/hydration safety

Potential hooks:

```ts
useRayden()
useRaydenFlavour()
useRaydenMotion()
useReducedMotionPreference()
```

Do not add a hook if CSS data attributes solve the problem.

---

## 34. Testing strategy

### Unit

- token resolver tests
- preset resolver tests
- provider default/override tests
- reduced-motion resolution
- registry metadata validation

### Component

For representative components:
- keyboard behaviour
- focus states
- flavour switching
- motion preset switching
- disabled/loading states
- controlled/uncontrolled behaviour remains intact

### Visual regression

Capture a matrix, but keep it manageable.

Minimum representative matrix:

```text
Component × Citrionus/Veyra/Gravion/Noctis/Aetherium × Light/Dark
```

Use a smaller golden component set initially:

- Button
- Input
- Card
- Tabs
- Dialog
- Switch

Then expand coverage.

### Accessibility

- automated axe checks where supported
- keyboard tests
- focus visibility
- reduced motion
- colour contrast review for each flavour/appearance pairing

### Registry

- schema validation
- install into a clean fixture app
- dependency resolution
- TypeScript build
- lint
- run at least one Codex-compatible MCP install workflow manually before marking agent support stable

---

## 35. Performance constraints

- A static flavour switch should primarily change CSS variables/data attributes, not remount the tree.
- Motion code should be tree-shakeable where possible.
- Components that do not animate should not pay for Motion unnecessarily.
- Avoid layout-thrashing animation patterns.
- Prefer transform/opacity for high-frequency visual transitions.
- Avoid giant client-only providers solely for theme data.
- Registry-installed components should not silently pull large dependencies.

Document dependency cost for recipes that require Motion.

---

## 36. Backward compatibility

This expansion should not require existing Rayden consumers to opt into Flavours or Motion.

Desired behaviour:

```tsx
<Button />
```

continues to render with the current/default Rayden styling unless an intentional major version change is planned.

The Default flavour should be calibrated to minimise visual regressions.

If token changes alter the existing look significantly, treat this as a migration and document it explicitly.

---

# PART VI — PHASED DELIVERY

## 37. Phase 0: repository audit

**Goal:** understand the existing architecture before modifying it.

Codex tasks:

1. Map current packages/folders.
2. Identify styling system: Tailwind/CSS variables/CSS modules/etc.
3. Identify primitive dependencies: Radix/Base UI/other.
4. Inventory theme tokens.
5. Identify components containing hard-coded radius/shadow/spacing/motion values.
6. Identify current animation dependencies.
7. Identify build/docs tooling.
8. Identify existing tests/Storybook/visual regression tooling.
9. Produce an audit summary and recommended least-disruptive integration points.

**Do not refactor yet.**

Deliverable: `docs/architecture/rayden-expansion-audit.md`.

---

## 38. Phase 1: flavour foundation

**Goal:** prove flavours on a small set of components.

Implement:

- flavour types
- provider/data attribute mechanism
- flavour token files for Citrionus, Veyra and Gravion
- initial semantic shape/surface/type tokens
- Button
- Input
- Card
- docs switcher/demo

Acceptance criteria:

- same component API across all flavours
- switching flavour does not remount components
- no inaccessible focus regression
- Citrionus remains close to current Rayden appearance
- Veyra and Gravion are visibly distinct without changing accent colour
- dark/light both work

---

## 39. Phase 2: motion foundation

**Goal:** establish semantic motion architecture.

Implement:

- motion token types
- Calm, Snappy, Playful, Reduced presets
- reduced-motion resolution
- Pressable primitive
- Reveal primitive
- Collapse primitive
- SharedLayout primitive
- motion recipe resolver
- integrate with Tabs and Dialog as pilot components

Acceptance criteria:

- components consume recipes/presets, not arbitrary local values where avoidable
- reduced-motion behaviour is verified
- Gravion + Calm and Veyra + Snappy combinations both work
- no mandatory Motion bundle cost for non-animated static components if architecture allows separation

---

## 40. Phase 3: registry distribution

**Goal:** make Rayden consumable by agents and CLI.

Implement:

- root `registry.json`
- registry item generation/build if needed
- namespace docs
- registry items for pilot components, flavour setup and motion foundation
- accurate dependencies and registry dependencies
- schema validation
- install smoke tests into a fixture project

Acceptance criteria:

- `shadcn add` equivalent succeeds
- installed component compiles
- registry item pulls required Rayden files/dependencies
- no undeclared imports
- descriptions are useful to agents

---

## 41. Phase 4: Codex/MCP workflow

**Goal:** prove natural-language installation.

Document and test:

- configure Rayden registry namespace
- configure shadcn MCP for Codex
- ask Codex to list Rayden items
- ask Codex to install Button/Tabs
- ask Codex to build a small screen using Rayden components
- evaluate whether it respects flavour and token conventions

Capture failure modes and improve metadata/rules before building a custom MCP.

---

## 42. Phase 5: Copy Prompt + metadata

**Goal:** make component pages agent-ready.

Implement:

- canonical metadata schema
- metadata for pilot components
- prompt generator
- Copy Prompt button
- Copy CLI button
- dependency display
- accessibility/motion metadata
- `rayden-conventions` registry rule item

Acceptance criteria:

- copied prompt identifies the exact Rayden item
- dependencies are handled
- prompt instructs agent to preserve tokens/accessibility/reduced motion
- component metadata powers both docs and generated prompt

---

## 43. Phase 6: expand flavour coverage

Complete the canonical five-flavour set by adding **Noctis** and **Aetherium** on the same semantic token architecture proven by Citrionus, Veyra and Gravion. Do not introduce flavour-specific component forks.

Then migrate remaining core components in controlled batches.

Prioritise:

- Tabs
- Dialog
- Select
- Dropdown Menu
- Checkbox
- Radio Group
- Switch
- Tooltip
- Popover
- Toast
- Accordion

Add visual regression coverage as each component is migrated.

---

## 44. Phase 7: Motion catalogue and Motion Studio

Only after primitives and recipes have survived real component usage.

Add:

- richer recipe catalogue
- recipe docs
- comparison playground
- spring/curve visualisation
- Copy Prompt for motion recipes
- “apply to component” prompt patterns

Do not expose a huge raw parameter surface before sane presets exist.

---

## 45. Phase 8: machine-readable catalogue

Add:

- `/llms.txt`
- `/llms-full.txt`
- structured JSON catalogue
- optional lightweight search/suggest endpoint

Only build a custom Rayden MCP after evaluating whether this adds meaningful capabilities beyond shadcn MCP.

---

# PART VII — CODEX WORKING INSTRUCTIONS

## 46. How Codex should approach this repository

When this document is given to Codex, use the following operating rules.

### 46.1 Audit first

Do not assume the folder names or architecture in this brief match the actual repository. Inspect the repository and map these concepts to the existing structure.

### 46.2 Avoid “big bang” refactors

Prefer a sequence of reviewable commits/PR-sized changes. Maintain current APIs unless a change is clearly required.

### 46.3 Reuse current foundations

If Rayden already has:

- a Provider
- theme tokens
- CSS variables
- motion helpers
- a docs metadata system
- registry scaffolding

extend them rather than creating parallel systems.

### 46.4 Preserve component semantics

Visual work must not quietly change keyboard, ARIA, controlled/uncontrolled state, form behaviour or DOM semantics.

### 46.5 Explain architectural conflicts

If this brief conflicts with the actual repo, document the conflict and choose the least disruptive design that preserves the intent.

### 46.6 Test after every foundation change

At minimum run the repository's existing:

- typecheck
- lint
- unit tests
- component tests
- build

Do not invent commands. Read `package.json` and workspace configuration.

---

## 47. Codex starter prompt

Use this as the first instruction after placing this document in the repository:

```text
Read `Rayden_UI_Flavours_Motion_Agent_Implementation_Brief.md` in full.

Do not implement everything at once.

Start with Phase 0 only: audit the current Rayden UI repository against the brief.

Specifically:
1. Map the current repo/package structure.
2. Identify the component primitive layer and styling/token architecture.
3. Identify existing provider/theme APIs.
4. Identify current animation dependencies and component-level motion.
5. Identify hard-coded visual values that would block flavours.
6. Identify existing registry, docs metadata and AI/agent integration, if any.
7. Identify the safest integration points for Flavours, Motion and a shadcn-compatible registry.
8. Call out any recommendations in this brief that conflict with the actual codebase.
9. Produce `docs/architecture/rayden-expansion-audit.md` with findings and a proposed implementation sequence.

Do not perform broad refactors in this phase. You may add the audit document only.
```

---

## 48. Codex Phase 1 prompt

After reviewing the audit:

```text
Using the approved repository audit and the Rayden expansion brief, implement Phase 1: the flavour foundation.

Constraints:
- Preserve existing public component APIs.
- Extend current theme/provider/token foundations instead of creating duplicates.
- Implement only Citrionus, Veyra and Gravion in the foundation pass; Noctis and Aetherium follow once the token architecture is proven.
- Pilot on Button, Input and Card.
- Keep appearance/accent independent from flavour.
- Prefer CSS custom properties and low-specificity data attributes where compatible with the existing stack.
- Do not introduce motion architecture yet except where necessary to preserve existing behaviour.
- Add tests and docs examples for Citrionus, Veyra and Gravion in light and dark modes.
- Run typecheck, lint, tests and build using existing repo scripts.

Before editing, summarise the exact files you plan to change and why. Then implement.
```

---

## 49. Codex Phase 2 prompt

```text
Implement Phase 2 of the Rayden expansion brief: semantic motion foundation.

Use the actual repo architecture and the Phase 0 audit.

Implement:
- motion token taxonomy
- Calm, Snappy, Playful and Reduced presets
- prefers-reduced-motion handling
- reusable Pressable, Reveal, Collapse and SharedLayout behaviours/primitives where appropriate
- recipe resolution
- pilot integration in Tabs and Dialog

Constraints:
- Keep motion personality independent from visual flavour.
- Use CSS for simple transitions when it is sufficient.
- Do not add a second animation library if the repo already has a suitable one.
- Avoid raw arbitrary duration/spring values in component files when a semantic token/recipe is suitable.
- Preserve keyboard and ARIA behaviour.
- Add tests and docs examples.
```

---

## 50. Codex Phase 3 prompt

```text
Implement Phase 3: Rayden's shadcn-compatible registry.

Before implementation, verify the current shadcn registry schema and CLI expectations against official documentation.

Requirements:
- Create/extend a root registry catalogue.
- Add pilot registry items for the flavour foundation and selected components.
- Accurately declare dependencies and registryDependencies.
- Use an @rayden namespace pattern in documentation.
- Add schema validation.
- Add a clean fixture/install smoke test.
- Verify a component can be installed into a clean supported project and compiled.
- Do not build a custom MCP server.

Document how the existing shadcn MCP can consume the registry.
```

---

# PART VIII — DECISIONS, NON-GOALS & RISKS

## 51. Key architectural decisions

### Decision A
**Flavours are global/subtree design grammars, not component variants.**

### Decision B
**Appearance and accent remain independent from flavours.**

### Decision C
**Motion has its own semantic token/preset/recipe system.**

### Decision D
**Visual flavour may recommend but never hard-lock a motion preset.**

### Decision E
**Rayden should support copy-first/registry consumption alongside any NPM package distribution.**

### Decision F
**Use shadcn-compatible registry + existing MCP infrastructure before considering custom MCP.**

### Decision G
**Agent metadata should come from a canonical source of truth and power docs/prompts/registry descriptions.**

---

## 52. Explicit non-goals for the first release

Do not attempt all of the following in v1:

- 8–10 flavours beyond the canonical five
- full visual builder
- custom Rayden MCP server
- AI-generated components hosted by Rayden
- marketplace/community publishing
- full block/template marketplace
- every animation engine
- Figma plugin integration
- arbitrary user-authored flavour DSL
- automatic conversion of third-party components to Rayden

Those are possible future branches, not foundation work.

---

## 53. Risks

### 53.1 Token explosion

If every component gets dozens of component-specific variables, flavours become unmaintainable.

Mitigation: favour shared semantic grammar; create component tokens only where component semantics genuinely differ.

### 53.2 Flavours become themes

If Veyra merely changes colour, the concept has failed.

Mitigation: evaluate each flavour in monochrome/neutral accent. It should still be recognisable through shape, surface, proportion and state treatment.

### 53.3 Motion becomes decoration soup

If every component receives a different flashy animation, Rayden loses coherence.

Mitigation: recipes + semantic presets + explicit non-use guidance.

### 53.4 Bundle bloat

Animation can quietly make the library expensive.

Mitigation: CSS-first where suitable, separate motion package/path, tree-shakeable exports, transparent dependencies.

### 53.5 Agent hallucination/drift

An agent can install a component and then “helpfully” overwrite its design tokens.

Mitigation: strong registry descriptions, composition hints, installable rules, Copy Prompt constraints and smoke tests with real agents.

### 53.6 Backward visual regressions

Tokenising current components can inadvertently change existing appearance.

Mitigation: calibrate Default to current Rayden, use visual regression baselines, migrate component-by-component.

---

# PART IX — DEFINITION OF DONE

## 54. Flavours v1 is done when

- Citrionus, Veyra, Gravion, Noctis and Aetherium exist.
- At least six representative components use the flavour token system.
- Flavours work in light and dark appearance.
- Accent can change independently.
- A user can switch flavours globally without changing component APIs.
- Visual regression tests cover the pilot matrix.
- Accessibility checks pass.
- Docs show realistic application-level previews.

---

## 55. Motion v1 is done when

- semantic duration/easing/spring/distance tokens exist
- Calm, Snappy, Playful and Reduced presets exist
- reduced-motion handling is reliable
- at least four reusable behaviours/primitives exist
- Tabs and Dialog use the new architecture
- motion can be overridden independently of flavour
- docs explain when to use each behaviour
- no obvious arbitrary animation constants remain in pilot components

---

## 56. Agent-native v1 is done when

- Rayden publishes a valid shadcn-compatible registry
- pilot items install cleanly via CLI
- registry is usable through shadcn MCP with Codex or another supported client
- component metadata is structured
- Copy Prompt exists for pilot components
- a Rayden agent conventions/rules item exists
- a clean fixture project compiles after install
- docs show installation for both human CLI and agent workflows

---

# PART X — RECOMMENDED IMMEDIATE NEXT STEPS

## 57. Start here

1. Put this brief in the Rayden repository.
2. Give Codex the Phase 0 starter prompt.
3. Review the audit before allowing architecture changes.
4. Implement Flavours on Button/Input/Card only.
5. Stress-test Citrionus/Veyra/Gravion in both appearances, then extend the matrix to Noctis/Aetherium.
6. Add motion foundations and pilot Tabs/Dialog.
7. Build the shadcn registry.
8. Test installation through Codex/shadcn MCP.
9. Only then expand component coverage and build richer docs tooling.

The most important early proof is not “we have three pretty themes.” It is:

> **Can one stable Rayden component API express genuinely different visual identities and motion personalities while remaining accessible, maintainable, installable and intelligible to coding agents?**

If yes, the expansion has a strong foundation.

---

# Appendix A — Example token sketch

```css
:root {
  --r-duration-fast: 100ms;
  --r-duration-normal: 180ms;
  --r-duration-slow: 260ms;

  --r-distance-micro: 2px;
  --r-distance-short: 4px;
  --r-distance-medium: 8px;

  --r-shape-control-radius: 0.5rem;
  --r-shape-container-radius: 0.75rem;
  --r-border-default-width: 1px;
}

[data-rayden-flavour='veyra'] {
  --r-shape-control-radius: 0.75rem;
  --r-shape-container-radius: 1rem;
  --r-state-hover-lift: -1px;
}

[data-rayden-flavour='gravion'] {
  --r-shape-control-radius: 0.25rem;
  --r-shape-container-radius: 0.375rem;
  --r-state-hover-lift: 0px;
}

[data-rayden-motion='calm'] {
  --r-motion-interactive-duration: var(--r-duration-normal);
  --r-motion-distance: var(--r-distance-short);
}

[data-rayden-motion='snappy'] {
  --r-motion-interactive-duration: var(--r-duration-fast);
  --r-motion-distance: var(--r-distance-micro);
}
```

---

# Appendix B — Example metadata object

```ts
export const animatedTabsMeta = {
  name: 'animated-tabs',
  title: 'Animated Tabs',
  description: 'Tabs with a shared-layout active indicator using Rayden Motion.',
  category: ['navigation'],
  tags: ['tabs', 'navigation', 'motion', 'shared-layout'],
  status: 'beta',
  dependencies: ['motion'],
  registryDependencies: ['tabs', 'motion-tokens'],
  accessibility: {
    keyboard: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
    reducedMotion: 'Indicator changes without translated shared-layout animation.',
  },
  flavours: {
    supported: 'all',
  },
  motion: {
    supported: true,
    recipes: ['selection.sharedPill'],
    defaultPreset: 'snappy',
  },
  compositionHints: [
    'Use for peer navigation within the same view.',
    'Preserve router/state integration from the host application.',
  ],
  avoidWhen: [
    'Do not use Tabs as a substitute for primary route navigation when URLs should be independently addressable.',
  ],
} as const
```

---

# Appendix C — Reference material verified 20 September 2026

These references informed the architecture. They are inspiration and ecosystem evidence, not dependencies unless explicitly adopted.

1. **shadcn/ui — MCP Server**  
   https://ui.shadcn.com/docs/mcp  
   Key point: agents can browse, search and install from configured registries; compatible third-party registries work with the shadcn MCP server.

2. **shadcn/ui — Registry documentation**  
   https://ui.shadcn.com/docs/registry  
   https://ui.shadcn.com/docs/registry/getting-started  
   Key point: custom registries can distribute components, hooks, pages, config, rules and other files.

3. **shadcn/ui — GitHub Registries (June 2026)**  
   https://ui.shadcn.com/docs/changelog/2026-06-github-registries  
   Key point: a public GitHub repository can act as a source registry with a root `registry.json`.

4. **21st — MCP / agent workflows**  
   https://21st.dev/mcp  
   Key point: prompt-native component search/install/generation and publishing workflows.

5. **21st — Component Libraries (May 2026)**  
   https://21st.dev/blog/component-libraries  
   Key point: libraries reduce agent UI drift by making shipped components the reusable source of truth.

6. **SmoothUI — AI Integration**  
   https://smoothui.dev/docs/guides/ai-integration  
   Key point: MCP + REST + machine-readable catalogue + `llms.txt` patterns.

7. **UI Beats**  
   https://uibeats.com/  
   Key point: agent-aware catalogue, tunable props and Motion Studio for easing/spring experimentation.

8. **Animate UI**  
   https://animate-ui.com/docs  
   Key point: copy-first animated primitives/components built around Motion and shadcn-style distribution.

9. **Motion Primitives**  
   https://motion-primitives.com/docs  
   Key point: reusable animated components/primitives intended to integrate into existing design systems.

---

# Appendix D — Short product statement

**Rayden UI is an open component system where visual personality, motion personality and brand theme are composable rather than hard-coded. It is designed to be browsed by humans, installed by coding agents and adapted without losing accessibility or design consistency.**
