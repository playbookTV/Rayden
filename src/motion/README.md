# Rayden Motion pilot

Import primitives and metadata from `@raydenui/ui/motion` and include the existing
`@raydenui/ui/styles.css`. No third-party animation runtime is required.

```tsx
import { Tabs, Tab, Modal } from "@raydenui/ui";
import { MotionProvider, Pressable, Reveal, Collapse } from "@raydenui/ui/motion";

<MotionProvider preset="snappy">
  <Tabs motion defaultValue="overview">
    <Tab value="overview">Overview</Tab>
    <Tab value="details">Details</Tab>
  </Tabs>
</MotionProvider>;
```

## Resolution and scope

- `MotionProvider` is a context-only scope. Its `preset` is optional and inherits
  from its parent; the root default is `calm`. It does not mutate `<html>`.
- Presets are `calm`, `snappy`, `playful`, and `reduced`. Playful uses larger
  distances and scale changes with smooth easing; physics/springs are outside this pilot.
- React portals inherit the provider. Native modal panels receive the effective
  motion state through React, independently of where their DOM is mounted.
- Every primitive accepts `motion?: boolean | MotionPreset`, defaulting to `true`.
  `true` uses the provider; a named preset overrides it; `false` disables motion.
- Tabs and Modal keep motion **off by default**. Their new `motion` prop has the
  same shape. Enabling a provider alone does not animate existing components.
- OS reduced motion always wins over requested presets. Changes cancel active
  animations and settle the current state immediately. Server rendering conservatively
  resolves to reduced motion; hydration adopts the browser's actual preference.
- `useRaydenMotion(option?)` returns `requestedPreset`, effective `preset`,
  `reducedMotion`, and `tokens`. Use effective tokens for custom behavior.
- `getMotionRecipe(name, preset?)` is a pure metadata lookup and cannot inspect the
  user's OS preference. Pass the effective preset from `useRaydenMotion` in UI code.

## Primitive contracts

| Primitive | Intended use | Behavior and constraints |
| --- | --- | --- |
| `Pressable` | Native button press feedback | Preserves native click, keyboard, disabled and form behavior; defaults to `type="button"`. Pointer cancellation, blur and keyboard release clear the pressed state. It is not an anchor or a wrapper around another interactive control. |
| `Reveal` | Presence of supplementary content | `present` defaults to true; `recipe` is `appear.fade`, `appear.fadeUp` (default), or `appear.scale`. Retains content for exit, removes it afterward, and makes exiting content inert. For focus-managed overlays use Modal instead. |
| `Collapse` | Optional disclosure content | Required `open`; persistent region with grid-row/opacity transition, inert when closed. Supply a trigger with `aria-controls` and `aria-expanded`. Dynamic content remains natural-height. This necessarily updates layout, so avoid animating many large regions simultaneously. |
| `SharedLayout` | One persistent selection marker | Required `layoutKey` signals a geometry change. FLIP animates transform/scale from previous geometry; interruptions continue from the current visual position. This is not a cross-tree shared-ID/presence system. It owns the node's animated transform; put authored transforms on a child. |

Reveal, Collapse and SharedLayout render a `div`; place them only where a div is
valid. They do not manufacture roles, labels, list semantics or tab panels.
Pressable renders a button and forwards its ref and native attributes.

Tabs selection and roving focus update immediately, even while its visual
indicator is moving. It supports the existing line, pill, segmented and vertical
layouts. Tabs still represents a tab list; content panels remain application-owned.

Modal animates only its panel. The native dialog stays modal through exit, retaining
focus and background inertness until its final close. Escape/backdrop policies and
controlled `onClose` semantics are unchanged. Reopening during exit cancels dismissal;
unmount cancels animation, closes the dialog, restores its trigger and releases scroll
locking. Backdrop motion and nested modal scroll-lock coordination are not added here.

## Metadata and verification

`motionPresets`, `motionRecipes` and `getMotionRecipe` expose the same values used
by the runtime. The recipe inventory is intentionally bounded to the primitives,
selection indicators and dialog panel implemented in this pilot. Metadata does not
claim support for unimplemented springs, counters, pointer following or Motion Studio.

`MotionPilot.stories.tsx` includes preset examples and browser interaction checks
for keyboard tabs, portals, interrupted exits, press cancellation, disclosure
inertness, unmount cleanup and live reduced-motion preference changes. The preference
change story uses a controlled MediaQueryList; also inspect a consuming application
with browser/OS reduced-motion emulation before release.
