# Blocks Batch C — navigation and shells

Status: implemented, polished, and publicly exported from `@raydenui/ui/blocks`, with documentation, AI manifests and catalog wiring complete. See the [22 September resolution and verification record](blocks-batch-c-polish.md) for current results. The implementation notes below describe the original batch and retain its historical checks and limitations.

Date: 22 September 2026.

Batch C delivers the four Navigation & shells blocks that compose into one application chrome: plan ideas 02 (Application Shell), 03 (Page Header & Actions), 04 (Workspace Switcher), and 06 (Command Palette). Navigation is where the [21 September audit](blocks-audit-2026-09-21.md) found its worst defects, so the four are specified against those defects rather than against a fresh design.

| Block | File | Stories |
|---|---|---|
| Application Shell | `src/blocks/ApplicationShellBlock.tsx` | `src/blocks/ApplicationShellBlock.stories.tsx` |
| Page Header & Actions | `src/blocks/PageHeaderBlock.tsx` | `src/blocks/PageHeaderBlock.stories.tsx` |
| Workspace Switcher | `src/blocks/WorkspaceSwitcherBlock.tsx` | `src/blocks/WorkspaceSwitcherBlock.stories.tsx` |
| Command Palette | `src/blocks/CommandPaletteBlock.tsx` | `src/blocks/CommandPaletteBlock.stories.tsx` |
| Composition | — | `src/blocks/ApplicationChromeComposition.stories.tsx` |

The original batch created new files only. The follow-up polish also updates shared class merging, distribution and documentation; see the resolution record.

## Shared conventions

These continue [Batch A](blocks-batch-a.md) and [Batch B](blocks-batch-b.md) rather than re-deciding them.

| Convention | Reason |
|---|---|
| `headingLevel` prop typed `"h1"`–`"h6"` | Batch B's form. A shell legitimately owns a page `h1`, so a numeric `2–6` union could not express it. See "Heading-level inconsistency" below. |
| Destinations render `<a href>`, actions render `<button>` | Audit B01 and B10. One link-aware element serves the expanded and the collapsed arrangement, so an href can never be rebuilt into a dead button. |
| Each navigable thing is a TypeScript union of `{ href }`, `{ onClick }`, or `{ unavailableReason }` | Makes a control with nothing to do impossible to configure, and makes a permission-blocked entry an explicit third state rather than an absence. |
| `bg-surface`, `bg-surface-muted`, `border-surface-border`, `border-surface-border-strong` | Audit B07. |
| `text-action-primary-text` for readable orange | Audit B05: `--color-action-primary` is a fill role and measures 3.69:1 on white. |
| `@container` on the block root, `@min-[…]` inside | A block sits in a container the consumer chooses. The `@container` sits on the outermost element, **outside** any padded surface, or the `@min-[…]` padding inside that surface resolves against the wrong box. |
| Minimum heights on controls, never fixed widths | Audit B13. |
| `min-w-0` and `break-words` on every flex and grid child | Long compound words wrap rather than widening the document. |
| Block roots are `relative` | Audit B03: the shell's skip link is absolutely positioned and must not escape. |
| Overlays and popovers stay mounted and `hidden` | Audit B01: `aria-controls` must resolve to an element that is in the document, including while the thing it controls is closed. |

Data and persistence belong to the consuming application. Every block exposes callbacks and fetches nothing.

## Application Shell

**File:** `src/blocks/ApplicationShellBlock.tsx`

Composes a sidebar, a workspace area, a top bar, and a collapsed navigation arrangement without losing destinations.

### Layout contract

One instance of each feature, not two. The top bar is rendered at **every** width and holds the brand, the workspace switcher slot, the search slot, and the trailing actions. Only the navigation list is rendered twice — once in the sidebar, once in the collapsed panel — and it is pure data, so the two copies cannot diverge. The search field wraps onto its own row below `640px` of container width instead of being removed.

`expandAt` picks the container width at which the sidebar appears: `"sm"` 720px, `"md"` 900px (default), `"lg"` 1080px. It reads the shell's own width, so a shell in a 360px column collapses on a 1440px screen.

### Props

| Prop | Type | Notes |
|---|---|---|
| `brand`, `brandHref`, `onBrandClick` | `ReactNode`, `string`, `() => void` | Without a destination or handler the brand is not a control. |
| `navSections` | `AppShellNavSection[]` | `{ id, label?, items }`. A labelled section becomes a heading plus an `aria-labelledby` list. |
| `navLabel` | `string` | Accessible name for the navigation landmark. Default `"Main"`. |
| `sectionHeadingLevel` | `"h1"`–`"h6"` | Default `"h2"`. |
| `navStatus` | `"idle" \| "loading" \| "error"` | |
| `navErrorMessage`, `onRetryNav`, `navLoadingMessage` | | The retry control is omitted entirely when no handler is supplied. |
| `navEmptyMessage` | `string` | No default. Without it a shell with no destinations renders no rail and no toggle at all; supplying it asks for the rail with an explanation. |
| `search` | `ReactNode` | One instance, in the top bar, at every width. |
| `switcher` | `ReactNode` | One instance, in the top bar, at every width. |
| `actions` | `AppShellAction[]` | Icon-only when an `icon` is supplied; the `label` is the accessible name. |
| `actionsLabel` | `string` | Default `"Account and tools"`. |
| `sidebarFooter` | `ReactNode` | Rendered in both the sidebar and the collapsed panel. Keep it stateless or controlled. |
| `openMenuLabel`, `closeMenuLabel`, `skipLinkLabel`, `mainLabel` | `string` | Translatable. |
| `expandAt` | `"sm" \| "md" \| "lg"` | Default `"md"`. |
| `mainScroll` | `"page" \| "region"` | Default `"page"`. See below. |
| `stickyTopBar` | `boolean` | Default `true`. Ignored in `region` mode, where the bar is already fixed by the grid. |
| `children` | `ReactNode` | Workspace content. |
| `className` | `string` | Lands on the container root, outside the top bar and the workspace padding. |

`AppShellNavItem` is `{ id, label, icon?, description?, badge?, badgeDescription?, current? }` plus exactly one of `{ href, external?, onClick? }`, `{ onClick }`, or `{ unavailableReason }`.

### Scrolling

`mainScroll="page"` is the default and gives the shell exactly **one** scroll region — the document. This is deliberate: a palette overlay above a second, independently scrolling workspace is where nested-scroll bugs appear. `mainScroll="region"` gives the workspace its own scrollbar and needs a bounded height on the shell, passed through `className` (for example `h-[100dvh]`). In that mode the workspace is given `tabIndex={0}`, because a scroll container whose content is not focusable is unreachable from the keyboard (WCAG 2.1.1); in `page` mode it stays `tabIndex={-1}` as a skip-link target only.

### States

- **default** — sidebar, top bar, workspace.
- **loading** (`navStatus`) — a `role="status"` line with a spinner. The top bar and workspace are unaffected, because a navigation fetch failing does not make the page unusable.
- **error** (`navStatus`) — a `role="alert"` panel with an optional retry.
- **empty** — two different situations, kept apart. With `navEmptyMessage` the rail is rendered and states why it is empty. Without it, a shell with no destinations renders no rail, no toggle, and no panel, because a disclosure that opens nothing is a control with no action.
- **permission** — a nav item carrying `unavailableReason` renders as a disabled button with a visible reason associated through `aria-describedby`.
- **success** — not applicable. The shell submits nothing.

## Page Header & Actions

**File:** `src/blocks/PageHeaderBlock.tsx`

Establishes page context with breadcrumbs, a title, a status, and a prioritised action group.

### Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Required. |
| `headingLevel` | `"h1"`–`"h6"` | Default `"h1"`. Drop it to `"h2"` when the shell already owns the page heading. |
| `eyebrow`, `description` | `ReactNode` | The eyebrow is not a heading. |
| `breadcrumbs` | `PageHeaderBreadcrumb[]` | The last crumb is the current page: plain text with `aria-current="page"`, never a link. |
| `breadcrumbLabel` | `string` | Default `"Breadcrumb"`. |
| `maxVisibleBreadcrumbs` | `number` | Default `4`. Beyond it the middle collapses. |
| `breadcrumbExpandLabel`, `breadcrumbCollapseLabel` | `(hiddenCount) => string` | Translatable. |
| `status` | `{ label, tone?, description? }` | Tones: `neutral`, `success`, `warning`, `danger`. |
| `meta`, `metaLabel` | `PageHeaderMetaItem[]`, `string` | Rendered as a labelled `<dl>`. |
| `backAction` | `{ label, href?, onClick? }` | Rendered only when one of the two is supplied. |
| `actions`, `actionsLabel` | `PageHeaderAction[]`, `string` | |
| `maxInlineActions` | `number` | Default `3`. Primary actions are never moved. |
| `overflowLabel` | `string` | Default `"More actions"`. |
| `state` | `"default" \| "loading" \| "error"` | |
| `errorTitle`, `errorDescription`, `onRetry`, `loadingMessage` | | |
| `children` | `ReactNode` | Content under the header row, e.g. a tab bar. |
| `className` | `string` | Lands on the container root, outside the padded surface. |

`PageHeaderAction` is `{ id, label, icon?, priority?, description? }` plus one of `{ href, external?, onClick? }`, `{ onClick }`, or `{ unavailableReason }`. `priority` is `"primary" | "secondary" | "overflow"`, default `"secondary"`.

### Breadcrumb collapse

A trail longer than `maxVisibleBreadcrumbs` keeps its root and its final two levels. The levels between stay **mounted and hidden**, so the ellipsis toggle's `aria-controls` lists real element ids and the trail can be collapsed again after it is expanded. The toggle is a disclosure with a truthful `aria-expanded`, not a control that disappears once used.

### States

- **default** — crumbs, title, status, meta, actions.
- **loading** — placeholder shapes marked `aria-hidden`, plus a `role="status"` line; the section is `aria-busy`.
- **error** — a `role="alert"` panel inside the header, with an optional retry. The title and breadcrumbs stay, because the page context is still true.
- **permission** — an action carrying `unavailableReason` renders disabled with a visible reason.
- **empty** — not applicable; `title` is required.
- **success** — never manufactured. The header submits nothing.

## Workspace Switcher

**File:** `src/blocks/WorkspaceSwitcherBlock.tsx`

Find and switch a workspace, see the current one, and create or join another.

### Props

| Prop | Type | Notes |
|---|---|---|
| `current` | `WorkspaceSwitcherItem` | Shown on the trigger. |
| `workspaces` | `WorkspaceSwitcherItem[]` | Includes `current`. |
| `onSelect` | `(id) => void` | Required whenever a workspace without an `href` can be chosen. |
| `status` | `"idle" \| "loading" \| "error"` | |
| `errorMessage`, `onRetry`, `loadingMessage` | | |
| `triggerLabel`, `triggerHint`, `placeholder` | `string` | |
| `panelLabel`, `filterLabel`, `filterPlaceholder` | `string` | |
| `filterThreshold` | `number` | Default `6`. Below it the filter is omitted rather than shown over three entries. |
| `emptyTitle`, `emptyDescription` | `string` | The viewer belongs to no workspace. |
| `noMatchesTitle`, `noMatchesDescription` | `string` | The filter matched nothing. A different situation, worded differently. |
| `footerActions` | `WorkspaceSwitcherFooterAction[]` | "Create" and "Join". Rendered only when supplied. |
| `resultCountLabel` | `(count) => string` | Announced through a polite live region. |
| `open` / `defaultOpen` / `onOpenChange` | | Controlled and uncontrolled are both supported. |
| `className` | `string` | Lands on the container root. |

`WorkspaceSwitcherItem` is `{ id, name, detail?, logoSrc?, initials?, icon? }` plus either `{ href? }` or `{ unavailableReason }`.

### Keyboard and semantics

The trigger carries `aria-haspopup="dialog"`, `aria-expanded`, and an `aria-controls` that resolves while the popover is closed. Opening moves focus to the filter. `ArrowDown`/`ArrowUp` from the filter enter the list; within the list `ArrowDown`, `ArrowUp`, `Home`, and `End` move a roving tabindex, `Enter`/`Space` choose, and `Escape` closes and returns focus to the trigger. The popover is **not** modal and does not trap focus: `Tab` reaches the footer actions and then leaves, and a pointer press outside closes it.

A workspace with an `href` renders as a real anchor inside the listbox, so middle-click and open-in-new-tab keep working. A workspace carrying `unavailableReason` is `aria-disabled`, keeps its reason visible and associated, and cannot be chosen.

### Positioning

The popover is wider than its trigger, so it is placed from a measurement taken when it opens: start-aligned when it fits, end-aligned when it does not, and pinned to the viewport when neither side fits. Nothing is positioned until it is measured, so the popover can never push the document wider.

### States

default · loading · error with optional retry · empty source · no matches · permission-blocked entry · single workspace.

## Command Palette

**File:** `src/blocks/CommandPaletteBlock.tsx`

Search and activate application destinations and actions with keyboard support.

### Props

| Prop | Type | Notes |
|---|---|---|
| `items`, `groups` | `CommandPaletteItem[]`, `CommandPaletteGroup[]` | Ungrouped entries come first, then groups in the order given. |
| `suggestions`, `suggestionsLabel` | `CommandPaletteItem[]`, `string` | Shown while the query is empty. |
| `showAllWhenEmpty` | `boolean` | Default `false`. |
| `filterMode` | `"local" \| "external"` | `external` renders `items` untouched, for an application that searches remotely. |
| `onQueryChange`, `onSelect` | | `onSelect` fires for every activation, including a destination followed by its href. |
| `status` | `"idle" \| "loading" \| "error"` | |
| `errorTitle`, `errorDescription`, `onRetry`, `loadingMessage` | | |
| `dialogLabel`, `searchLabel`, `searchPlaceholder`, `searchHint`, `closeLabel` | `string` | Translatable. |
| `promptTitle`, `promptDescription` | `string` | Before anything is typed. |
| `noResultsTitle`, `noResultsDescription` | `(query) => string`, `string` | After a query that matched nothing. |
| `emptySourceTitle`, `emptySourceDescription` | `string` | Nothing is configured at all. |
| `resultCountLabel` | `(count) => string` | Drawn in the footer and announced. |
| `showTrigger`, `triggerLabel`, `triggerClassName` | | The block renders its own trigger by default. |
| `shortcut` | `{ key, modifier?, hint? } \| null` | Default `null`: no document listener is registered unless one is configured. |
| `open` / `defaultOpen` / `onOpenChange` | | Controlled and uncontrolled are both supported. |
| `lockScroll` | `boolean` | Default `true`. Freezes the page behind the overlay so the workspace and the palette do not both scroll. |
| `footer` | `ReactNode` | Next to the result count. |

`CommandPaletteItem` is `{ id, label, description?, icon?, keywords?, shortcut?, groupId? }` plus one of `{ href, external?, onSelect? }`, `{ onSelect }`, or `{ unavailableReason }`.

### Keyboard model

- The trigger opens the dialog; `aria-controls` resolves while it is closed.
- Opening focuses the search field and records what had focus.
- `ArrowDown` enters the results, `ArrowUp` enters from the end. Inside the list `ArrowDown`, `ArrowUp`, `Home`, and `End` move a roving tabindex.
- `Enter` in the field activates the current entry; `Enter` on a focused entry activates it — natively for an anchor, through the handler for an action.
- `Escape` closes from anywhere in the dialog.
- `Tab` and `Shift+Tab` cycle **inside** the dialog. Options parked at `tabindex="-1"` are excluded from that cycle; including them made the computed final stop wrong and let focus escape.
- On close, focus goes back to the block's trigger, or to whatever had focus when the palette opened.
- The result count sits in a `role="status"` live region, so filtering to nothing is announced rather than only drawn.

### States

- **type to search** — an empty query with no suggestions. Distinct from "no results", which requires a query to exist and echoes it.
- **suggestions** — an empty query with `suggestions` supplied.
- **results** — grouped, with ungrouped entries first.
- **no results** — echoes the query.
- **empty source** — nothing configured. Does not tell the reader to change a search term they have not typed.
- **loading** / **error** — consumer-owned, with an optional retry.
- **permission** — an entry carrying `unavailableReason` is `aria-disabled` with its reason associated.

## Composition

**File:** `src/blocks/ApplicationChromeComposition.stories.tsx` — `Blocks/Compositions/Application Chrome`

Eight stories assemble all four blocks with KpiOverviewBlock, TaskListBlock, and ProfileSettingsBlock as the workspace content: `FullChrome`, `PaletteOverChrome`, `SwitchWorkspace`, `NarrowChrome`, `BoundedScrollChrome`, `DarkChrome`, `CustomSurfaceChrome`, and `ShortcutChrome`.

Assembling them exposed three things per-block review did not:

1. **The heading outline across five blocks.** The shell renders nav section labels at `h2`, the page header owns the single `h1`, and the workspace blocks run at `h2`. `FullChrome` asserts exactly one `h1` and no level increasing by more than one.
2. **The page header needs a negative inset to sit flush.** The shell pads its workspace; a page header is a band, not a card. The composition passes `className="-mx-4 -mt-6 @min-[900px]:-mx-6 @min-[900px]:-mt-8"`, which is only possible because `className` lands on the container root rather than inside the padded surface.
3. **Nested scrolling.** `BoundedScrollChrome` puts the shell in `region` mode — the arrangement with two candidate scroll regions — and asserts that no element is a horizontal scroll region and that the workspace is the vertical one. `PaletteOverChrome` asserts that the page is frozen while the overlay is open and released when it closes.

## Verification

Measured on 22 September 2026. Two independent paths were used: the repository's own Storybook vitest runner, and a Playwright harness driving installed Google Chrome against the project's Storybook dev server. The harness uses the dev server rather than a standalone Vite root deliberately — a harness rooted outside the repository makes Tailwind's automatic source detection miss `src/blocks`, so block-only utilities silently do not compile and an unstyled block measures clean. Driving the project's own server removes that failure mode entirely.

The repository's default Playwright browser binary is still unavailable, so the vitest runner was given an executable-path override; `vitest.config.ts` was not edited.

| Check | Result |
|---|---|
| `pnpm typecheck` | Passes. |
| ESLint on the nine new files | Clean, 0 errors and 0 warnings. |
| Prettier on the nine new files | Formatted. |
| `pnpm check:docs` | Passes, 0 findings. |
| Storybook vitest runner | **5 files, 62 stories, all passing**, with `a11y: { test: "error" }` on every file so any axe violation fails the test. Re-run after every change in this batch. |
| Layout and overflow | **292 completed checks** — story fixtures × 320/390/768/1440 CSS px × light/dark — with **0 cases of `document.documentElement.scrollWidth` above the viewport**, **0 elements that are horizontal scroll regions**, and **0 page errors**. |
| Accessibility | **146 axe-core 4.11.1 scans** at 390 and 1440 in both themes across wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice, plus a 16-scan targeted re-check after the fixes below. |
| Keyboard | **84 tab stops across 10 fixtures.** Every Batch C control measured a 2px solid outline on `:focus-visible`. |
| 200% root text size | 20 checks at 320 and 1440 with the root font size doubled to 32px; 2 with horizontal overflow, both traced to a block outside this batch (below). |
| Visual review | Screenshots inspected at 1440 and 390 in both modes for the composition, and at 1440 for the deep breadcrumb trail, the narrow page header, the German shell, the palette, the long-name switcher, and the consumer palette. |

### What the measurements found

Six defects were found by measurement rather than by review, and all six are fixed.

1. **The workspace switcher collapsed to 0px inside the shell, at every width.** `container-type: inline-size` — what Tailwind's `@container` sets — makes an element's inline size independent of its own contents. As a shrinkable flex item in the shell's top bar, the switcher root therefore resolved to `0px` at 390, 768 and 1440 alike. `toBeVisible()` does not catch this: an element squeezed to nothing still passes it. Fixed by removing `@container` from the switcher and palette roots — neither needed an internal container query — and by giving the shell's switcher slot a `min-w-[168px]` floor. Two interaction checks now assert the rendered width, so the class of bug cannot return silently. The general rule this establishes: **a block root that must shrink-to-fit inside a flex row cannot carry `@container`.**
2. **The palette's search field had no focus indicator.** `focus:outline-none` on the field beat the `focus-visible:outline-2` ring. Found by the tab walk, removed.
3. **The shell's brand and sidebar footer sat outside every landmark.** The navigation landmark was on an inner element, so `region` flagged the brand in 19 stories. The sidebar wrapper and the collapsed panel are now the `nav` landmarks themselves, which puts the brand, the destinations and the footer inside one.
4. **The skip link was page content outside any landmark.** Wrapped in its own `nav aria-label="Skip links"`.
5. **The popover only re-measured on `window.resize`.** A root text-size change moved the trigger without firing it, leaving the popover placed from stale geometry and 4px over the viewport at 320px with 200% text. Now observed with a `ResizeObserver`.
6. **Class merging silently dropped a colour.** `cn("… text-action-primary-text", box)` where `box` contained `text-body-xs` dropped the colour, because `tailwind-merge` groups them together. Invisible in light mode; measured **1.88:1** in the dark story. The colour is now written last.

Two story fixtures were also wrong rather than the blocks: a consumer palette applied inside a dark document (the grey ramp inverts, the story's overrides do not, so muted text measured **4.19:1** and later **1.05:1**) — the theme stories are now scoped to `.rayden-light`; and a readout paragraph with no themed ground measuring **1.04:1** in dark mode.

### Remaining axe findings, and why they are not block defects

- `landmark-one-main` (4 stories) and `page-has-heading-one` (3 stories) report the node `<html>`. They fire because a standalone block rendered in a Storybook iframe is not a page. Every one of these stories renders correctly inside the composition, where the shell supplies `main` and the page header supplies the `h1`.
- `region` on `blocks-page-header--default` reports the header's own content. Same cause: standalone, the page header is not inside anyone's `main`. Inside the shell it is, and the composition stories scan clean.

After the fixes, the targeted re-check of the shell and both composition stories returned **0 violations** in both themes at both widths.

### Remaining findings that belong to other blocks

- **`KpiOverviewBlock`'s visually hidden sparkline data table escapes at 200% root text.** At a 320px viewport with a 32px root font size, the composition's document measured 407px. A culprit probe placed the offending nodes inside that table (`<caption>On-time delivery trend`, `<th>Value`, `<td>90`…) at x≈354 in a 320px document. This is audit defect B03's shape — a positioned hidden element widening the document — recurring under text scaling. The four Batch C blocks measured alone show no overflow at 200%. `KpiOverviewBlock` was not edited: Batch C creates new files only.
- **The shared `Input` and `Checkbox` focus treatment is a border-colour change with no outline or ring.** Five of the 84 tab stops had no indicator my probe could detect; all five are `Input`/`Checkbox` from `src/components` inside composed blocks from earlier batches. A border-colour change alone is a weak focus indicator and is worth a deliberate decision; these components are being edited concurrently, so no change was attempted here.

### Release gates

| Gate | Status |
|---|---|
| 1. Visual review | **Pass.** Screenshots inspected at 1440 and 390 in both modes for the composition and at 1440 for seven stress stories. Hierarchy, spacing and dark mode read correctly; no clipping or overlap found. This is where the collapsed switcher was caught — it was invisible to every automated check that had run until then. |
| 2. Responsive review | **Pass.** 292 checks at the four widths in both modes, narrow parent containers of 240–420px on a 1440px viewport for all four blocks, and 200% root text sizing. No horizontal overflow from Batch C code. |
| 3. Semantics and keyboard | **Pass for what was tested.** 146 axe scans plus a clean targeted re-check; a labelled `nav` landmark in every arrangement; `aria-controls` asserted to resolve on the shell toggle, the breadcrumb collapse, the overflow disclosure, the switcher trigger and the palette trigger; full arrow/Home/End/Enter/Escape walks; focus restoration asserted for the switcher, the palette and the shell menu; focus containment asserted for the palette dialog. **No screen-reader pass was performed.** |
| 4. Contrast and targets | **Pass.** 0 contrast violations remain in either mode at both widths. Controls carry a 40px minimum height; target size was not measured exhaustively for every control. |
| 5. Theming | **Pass.** Light, dark, a `.dark` island in a light document, and a consumer palette applied through the semantic surface roles are all covered by stories and included in the clean scans. The consumer-palette stories also document that a palette is written for one mode. |
| 6. Interaction checks | **Pass.** 62 stories run through the repository's own runner, of which 12 carry `play` functions making real behavioural assertions — not render smoke tests. |
| 7. Distribution | **Not met, deliberately.** These blocks are not exported from `src/blocks/index.ts`, have no catalog or AI metadata entry, and have no documentation page. Export wiring is handled separately, and the four blocks introduce no optional dependency. |

### Known limitations

- No screen-reader pass, no non-Chromium engine, and no operating-system text-size or full-browser-zoom test.
- The 200% probe changes the root font size; it is not an operating-system text setting.
- 51 fixture-runs in the full harness pass were lost to Storybook HMR reloads caused by concurrent edits elsewhere in the repository. Those are unmeasured, not failed; the 292 checks reported above are the ones that completed, and they cover all 62 stories.
- Target size was measured only as a minimum control height, not per control.
- The composition's negative inset on the page header (`-mx-4 -mt-6 …`) relies on `className` landing on the block's container root. That is the documented contract, but it is a contract a future refactor could break without a test noticing.

## Heading-level inconsistency across batches

Two heading contracts exist in the library and they disagree:

- **Batch A and Batch B** type `headingLevel` as the string union `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"`, defaulting to `"h2"` (`"h1"` for Product Hero).
- **The ActivityFeed repair** types its level as the numeric union `2 | 3 | 4 | 5 | 6`, defaulting to `3`.

Batch C uses the **string form**, for two reasons. A shell or a page header legitimately owns a page's `h1`, and the numeric union cannot express it. And the string value is the element name, so the component renders `<Heading>` directly instead of composing a tag name from a number.

This is a real inconsistency, not a Batch C decision to defend: a consumer configuring an ActivityFeed and a PageHeader on the same page writes `3` for one and `"h3"` for the other. It needs one owner's decision and a single migration. Batch C did not change ActivityFeed, because `src/components/` was being edited concurrently.

## Findings for other owners

These were observed while building Batch C and are outside its scope.

1. **`Modal`, `Alert`, and `Input` still hard-code `bg-white dark:bg-grey-50`** (`src/components/Modal/Modal.tsx:263`, `src/components/Alert/Alert.tsx:85` and `:139`, `src/components/Input/Input.tsx:103` and `:221`). They therefore do not follow a consumer's `--color-surface` — audit finding B07, still open in components. The Command Palette could not use `Modal` for its overlay and the four blocks render their own alerts and search fields for this reason. This repeats Batch A's finding 2 with three more components named.
2. **`SidebarMenu`'s `light` theme hard-codes `bg-white dark:bg-grey-50`** (`src/components/SidebarMenu/SidebarMenu.tsx`). The Application Shell renders its own navigation rather than composing `SidebarMenu`, which is duplication that will drift. A surface-role migration on `SidebarMenu` would let the shell delegate.
3. **A consumer surface override still needs a matching foreground override.** Setting `--color-surface-muted` to `#eceee3` left the library's muted text role (`grey-500`, `#667185`) at **4.19:1** on it — measured, below AA. The Batch C theme stories therefore override `--color-grey-500/700/900` alongside the grounds. Concurrent work in `src/styles/globals.css` has introduced a `--color-on-surface` / `-body` / `-secondary` / `-muted` / `-subtle` family aliased to the grey ramp, which is the right shape for this; Batch C did not adopt it because that file was being edited at the same time and the tokens are not yet settled. Batch C should migrate from `text-grey-*` to `text-on-surface-*` once it lands.
4. **There is no `info` ground or inverting info text role.** The palette has `--color-info-400` and `--color-info-500` only: no `info-50` ground and no `info` text role that inverts for dark mode. The Page Header therefore offers `neutral`, `success`, `warning`, and `danger` status tones and no `info`. Every other feedback family has the full `50`/`700` pair.
5. **Class merging can silently drop a colour.** `cn("… text-action-primary-text", "size-7 text-body-xs")` drops the colour, because `tailwind-merge` puts `text-body-xs` and `text-action-primary-text` in the same group. The bug is invisible in light mode — the inherited foreground happens to be readable — and only surfaced as a **1.88:1** contrast failure in the dark story. Any recipe that appends a size token after a colour token is exposed to this. Worth a lint rule or a documented ordering convention.
6. **`Button` still has no polymorphic escape hatch.** Batch A's finding 1 is unchanged, so all four blocks carry a local action recipe.
