# Batch C review resolution and visual polish

22 September 2026. Covers Application Shell, Page Header, Workspace Switcher, Command Palette and their Application Chrome composition.

## Resolved findings

- All four blocks and their public types are exported from `@raydenui/ui/blocks`, bringing the public block library to 24. Navigation documentation, four AI manifests, generated contracts, catalog and guidance include the new batch.
- Compact mobile navigation keeps the workspace picker and tools together. Branding remains available inside the collapsed navigation. Search remains visible on its own row.
- The page header supports `variant="plain"` for composition inside existing gutters. Secondary metadata collapses behind an accessible Page details disclosure below 640px; `collapseMetaOnSmallScreens={false}` keeps it visible. The composition removes repeated content headings and moves Share into the action disclosure.
- Unmodified palette shortcuts ignore editable fields, composition events, repeated keys and modified keystrokes. Ordinary typing works in both external fields and the palette itself.
- Workspace entries without a destination or selection callback are visibly unavailable with an explanation, customizable using `unavailableMessage`.
- Task badges derive from current task state. Suppliers opens a real sample directory; the profile time-zone option matches the sample value.
- Escape dismisses a child popover without also dismissing its parent mobile navigation.
- Shared class merging recognizes the complete Rayden type scale, preserving both font size and text color. A composition assertion checks that search remains 14px.
- Controls have more consistent 44px targets and quieter borders. The command palette has clearer vertical placement, a readable dark-mode search icon and a non-inverting backdrop; `--color-overlay` can override it.
- The application example fills the viewport, including its dark surface, while its explicitly bounded scrolling example retains its own height.

## Verification

- 261 browser tests passed across all block stories and the shared Button, Modal and Select stories (27 files). This includes regression checks for ordinary typing, unavailable workspaces, nested Escape behavior, live task counts and text sizing.
- Root and AI TypeScript checks, targeted lint, docs contracts, generated AI contracts/catalog and guidance checks passed. Seven AI package tests passed after building the AI package.
- The UI production build and clean consumer installation passed, including all 24 ESM/CommonJS block exports and server rendering checks. The refreshed local archive is `exports/raydenui-ui-0.9.7.tgz`; its contents include all four new runtime modules and public declarations.
- Live light and dark compositions measured no document overflow at 320, 390, 768 and 1440px. Screenshots inspected at phone and desktop widths, including workspace and palette overlays. Supplier navigation was exercised visually.

This is a targeted regression and visual review, not screen-reader, physical-device or cross-browser certification. Earlier batch audit measurements remain historical; they were not all repeated. The local archive is a development export, not a published release.
