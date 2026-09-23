# Blocks Batch A — marketing and conversion

Status: implemented and verified against the release gates in the [blocks expansion plan](blocks-expansion-plan.md). Not yet exported from `src/blocks/index.ts`, and not yet present in the AI catalog or manifests — both are separate wiring tasks.

Date: 22 September 2026.

Batch A delivers four blocks that compose into one landing page: plan ideas 49 (Product Hero), 50 (Feature Overview), 55 (Pricing Plans), and 05 (Site Footer). Three are from the plan's recommended first twelve; Feature Overview was added so the four form a complete page, which is the stated purpose of batching.

## Shared conventions

These apply to all four blocks and were chosen to avoid the defects recorded in the [21 September audit](blocks-audit-2026-09-21.md).

| Convention | Reason |
|---|---|
| `headingLevel` prop; sub-headings derive from it | Audit B09: a fixed `h3` cannot fit every consumer's hierarchy. |
| Destinations render `<a href>`, actions render `<button>` | Audit B10 and the shared requirement to use native links for destinations. |
| A call to action is a TypeScript union of `{ href }` or `{ onClick }` | Makes a control with neither impossible to configure. |
| `bg-surface`, `bg-surface-muted`, `border-surface-border`, `border-surface-border-strong` | Audit B07: `bg-white dark:bg-grey-50` does not follow a consumer's `--color-surface`. |
| `text-action-primary-text` for readable orange | Audit B05: `--color-action-primary` is a fill role and measures 3.69:1 on white. |
| `@container` on the block root, `@min-[…]` for internal layout | A block sits in a container the consumer chooses; viewport width is the wrong signal. |
| Minimum heights on actions, never fixed widths | Audit B13: `w-[135px]` wraps ordinary labels and breaks translated ones. |
| `min-w-0` and `break-words` on every flex and grid child | Long compound words must wrap rather than widen the document. |
| Block roots are `relative` and establish a containment context | Audit B03: an absolutely positioned `sr-only` element must not escape. |

Data and persistence belong to the consuming application. Every block exposes callbacks and fetches nothing.

## Product Hero

**File:** `src/blocks/ProductHeroBlock.tsx` · **Stories:** `src/blocks/ProductHeroBlock.stories.tsx`

Explains the product, shows a relevant example, and leads to a primary next step.

### Props

| Prop | Type | Notes |
|---|---|---|
| `headline` | `ReactNode` | Required. |
| `eyebrow`, `eyebrowBadge` | `ReactNode`, `string` | Label above the headline. Not a heading. |
| `description` | `ReactNode` | Capped at 60 characters per line for readability. |
| `headingLevel` | `"h1"`–`"h6"` | Default `"h1"`. Highlight values use the next level down. |
| `primaryCta`, `secondaryCta` | `ProductHeroCta` | `{ label, href, external?, onClick? }` or `{ label, onClick }`. |
| `note` | `ReactNode` | Small print under the actions. |
| `highlights` | `ProductHeroHighlight[]` | `{ id, label, value?, icon? }`, rendered as a list. |
| `media` | `ProductHeroMedia` | `{ src, alt, aspectRatio?, width?, height?, caption? }`. `aspectRatio` defaults to `"auto"`, which keeps the image's own proportions so a screenshot is never cropped. |
| `mediaSlot` | `ReactNode` | A live demo or embed. Takes precedence over `media`. |
| `mediaFallback` | `ReactNode` | Replaces the media when the image fails. |
| `align` | `"start" \| "center"` | `center` applies only when there is no media. |
| `state` | `"default" \| "loading" \| "error"` | |
| `onRetry` | `() => void` | The retry control is omitted entirely when this is absent. |

### States

- **default** — headline, description, actions, highlights, media.
- **loading** — placeholder shapes marked `aria-hidden`, with a `role="status"` message carrying the announcement, and `aria-busy` on the section.
- **error** — `role="alert"` panel with title, description, and an optional retry control.
- **Missing media** — a labelled `role="img"` placeholder. Not a broken image and not a silent gap.
- **empty** — not applicable. A hero without a headline is not a hero; `headline` is required.
- **success** — not applicable. The block submits nothing, so it never claims an outcome.

## Feature Overview

**File:** `src/blocks/FeatureOverviewBlock.tsx` · **Stories:** `src/blocks/FeatureOverviewBlock.stories.tsx`

Lets a visitor scan differentiated capabilities and follow the details that matter to them.

### Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Required. |
| `eyebrow`, `description` | `ReactNode` | |
| `headingLevel` | `"h1"`–`"h6"` | Default `"h2"`. Item titles use the next level down. |
| `features` | `FeatureOverviewItem[]` | `{ id, title, description?, icon?, badge?, cta? }`. Rendered as a `<ul>`. |
| `columns` | `2 \| 3 \| 4` | Default `3`. The widest column count; narrow containers reduce to one. |
| `variant` | `"card" \| "plain"` | Default `"card"`. |
| `footerCta` | `FeatureOverviewCta` | Section-level next step. |
| `state` | `"default" \| "loading" \| "empty" \| "error"` | Resolves to `empty` for an empty `features` array when left undefined. |
| `emptyState` | `{ title, description?, cta? }` | Wording is the caller's, so an empty source and a search with no matches read differently. |
| `onRetry` | `() => void` | Omitted when absent. |

### States

- **default** — the capability grid.
- **loading** — `loadingItemCount` placeholder cards, `aria-hidden`, with a status message.
- **empty** — distinguishes an empty source from a query with no matches through caller-supplied wording. Two stories demonstrate both.
- **error** — `role="alert"` with an optional retry.
- **success** — not applicable.

A feature's `cta` is omitted entirely when not supplied, so the block never renders a "Learn more" control that does nothing.

## Pricing Plans

**File:** `src/blocks/PricingPlansBlock.tsx` · **Stories:** `src/blocks/PricingPlansBlock.stories.tsx`

Compares plans, switches billing period, and communicates included usage and limits.

### Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Required. |
| `plans` | `PricingPlan[]` | Required. |
| `periods` | `PricingBillingPeriod[]` | `{ id, label, badge? }`. The switcher is hidden when fewer than two are supplied. |
| `period` / `defaultPeriod` / `onPeriodChange` | `string` / `string` / `(id) => void` | Controlled and uncontrolled are both supported. |
| `periodLegend` | `string` | Accessible name for the switcher. Default `"Billing period"`. |
| `headingLevel` | `"h1"`–`"h6"` | Default `"h2"`. Plan names use the next level down. |
| `locale` | `string` | Default `"en-US"`. Drives `Intl.NumberFormat`. |
| `priceFormatOptions` | `Intl.NumberFormatOptions` | Merged into the default options. |
| `formatPrice` | `(price, ctx) => ReactNode` | Full override. |
| `limitsLabel` | `string` | Default `"Included usage"`. |
| `featuresVisibleLimit` | `number` | Collapses longer feature lists behind a disclosure. |
| `defaultUnavailableReason` | `string` | Used when a plan supplies none of its own. |
| `notice` | `{ tone, title, description? }` | A consumer-confirmed outcome. |
| `footnote` | `ReactNode` | Tax treatment and similar small print. |
| `state` | `"default" \| "loading" \| "empty" \| "error"` | Resolves to `empty` for an empty `plans` array. |
| `onRetry` | `() => void` | Omitted when absent. |

`PricingPlan` carries `{ id, name, description?, badge?, highlighted?, prices, limits?, features?, cta?, availability?, unavailableReason?, currentLabel? }`. `prices` is keyed by period id; a `PricingPrice` is `{ amount?, currency?, unit?, custom?, originalAmount?, note? }`.

### States

- **default** — the plan grid at the selected period.
- **loading** — `loadingPlanCount` placeholder cards with a status message.
- **empty** — no plans published.
- **error** — `role="alert"` with an optional retry.
- **Per-plan `available`** — an active control, rendered as a link or a button according to the `cta`.
- **Per-plan `current`** — a "Current plan" badge, and a non-interactive marker in place of a control when no `cta` is supplied.
- **Per-plan `unavailable`** — an explicitly disabled button whose visible reason is associated through `aria-describedby`. Verified to resolve to a real element.
- **success** — never manufactured. Choosing a plan only calls `cta.onClick` or follows `cta.href`. A confirmation appears only when the consumer passes `notice`; this is asserted by two interaction checks.

Excluded features carry a visually hidden "Not included:" prefix as well as a distinct icon, so the distinction never rests on colour.

An earlier draft dimmed unavailable plan cards with `opacity-90`. The axe scan measured every label in that card at 4.03:1 against white, below AA. The dimming was removed; unavailability is now carried by the disabled control and its associated reason.

## Site Footer

**File:** `src/blocks/SiteFooterBlock.tsx` · **Stories:** `src/blocks/SiteFooterBlock.stories.tsx`

Browse grouped site links, legal information, social destinations, and locale controls.

### Props

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Accessible name for the `contentinfo` landmark. Default `"Site footer"`. |
| `brand` | `{ logo?, name?, description?, href? }` | Artwork is supplied by the consumer. |
| `groups` | `SiteFooterLinkGroup[]` | Each becomes a `<nav>` named by its heading. |
| `groupHeadingLevel` | `"h2"`–`"h6"` | Default `"h2"`. |
| `social` | `SiteFooterSocialLink[]` | `{ id, label, href, icon?, artwork?, external? }`. Falls back to visible text when neither icon nor artwork is given. |
| `copyright` | `ReactNode` | |
| `legalLinks`, `legalLabel` | `SiteFooterLink[]`, `string` | A named navigation landmark. |
| `localeControls` | `SiteFooterLocaleControl[]` | `{ id, label, value, options, onChange, hint? }`. `onChange` is **required**. |
| `children` | `ReactNode` | Extra content above the bottom bar. |

### States

**Default only, deliberately.** The footer presents destinations the consuming application already knows. There is nothing to load, submit, or confirm, so no loading, error, or success state is offered. Every section is optional and omitting one removes it rather than leaving an empty shell — the `Minimal` and `LinksOnly` stories demonstrate this. Because `onChange` is required on a locale control, the footer cannot render a switcher that does nothing.

The locale control is a **native `<select>`**, chosen deliberately: it stays usable at 320px, gives the platform picker on touch devices, needs no floating layer inside a page-bottom landmark, and follows `--color-surface`. The shared `Select` component hard-codes `bg-white dark:bg-grey-50` and so would not have followed a consumer surface override — see "Findings for other owners" below.

Its border uses `border-grey-500` rather than the library's usual `border-grey-300`. Measured against the footer ground, `grey-300` gives 1.39:1 and `grey-400` gives 2.44:1, both below the 3:1 that WCAG 1.4.11 asks of a control boundary; `grey-500` measures 4.66:1. This is a deliberate divergence from the library's input border and is raised below.

## Composition

**File:** `src/blocks/MarketingLandingComposition.stories.tsx` — `Blocks/Compositions/Marketing Landing`

Three stories:

- **FullPage** — hero, features, pricing, footer in the order a visitor meets them, with live period switching and feature disclosure.
- **NarrowContainer** — the whole page inside a 420px column, which is what proves the blocks follow their container rather than the viewport.
- **ScopedLightIsland** — a `.rayden-light` island inside a globally dark document.

Assembling the four exposed three things that per-block review did not: the heading outline across blocks (now one `h1` with no skipped levels, asserted), section rhythm across four different backgrounds, and the behaviour of `bg-surface-muted` bands in dark mode.

## Verification

Measured on 22 September 2026 with Playwright 1.58.2 driving installed Google Chrome through an executable-path override, against a Vite harness that renders the unchanged story `render` functions at full viewport width. axe-core 4.11.1 was injected from the workspace store. The repository's default Playwright browser binary was unavailable, as in the September audit.

| Check | Result |
|---|---|
| `pnpm typecheck` | Passes. |
| `pnpm --filter @raydenui/ai check-generated` | Passes — the contract and catalog generators read `src/components`, not `src/blocks`, so these blocks required no regeneration. |
| Layout and overflow | 39 story fixtures × 320/390/768/1440 CSS px × light/dark = **312 checks, 0 with `document.documentElement.scrollWidth` above the viewport, 0 page errors**. |
| Accessibility | 39 fixtures × 390/1440 × light/dark = **156 axe-core scans, 0 violations** across wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, and best-practice. |
| Interaction | **18/18 checks pass** — see the list below. |
| Container adaptation | At a 1440px viewport, each block in a 358px container collapses to one column (features 3→1, pricing 3→1, hero 2→1 with the headline stepping 48px→32px, footer 4→2); the composition in a 420px column is single-column throughout. |
| 200% root text sizing | 5 fixtures × 320/1440 with the root font size doubled to 32px: **0 with horizontal overflow**. |
| Nested scrolling | No element in the composition has a horizontal scroll region at any of the four widths. |

### Interaction checks

Clicking the visible period label switches period and updates prices · the switch target is 147×38px · the switcher is a `fieldset` + `legend` radio group with exactly one selection · arrow keys move the selection and update prices · the feature disclosure expands 14→23 items and flips `aria-expanded` · unavailable plans are disabled with an `aria-describedby` that resolves to a real reason element · every anchor has an `href` · plan selection raises a callback and renders no status notice · a confirmation appears only when the consumer supplies `notice` · the locale select is labelled and wired · the footer has named landmarks, 26/26 anchors with `href`, no anchor with `role="button"`, and `rel="noreferrer"` on every `target="_blank"` · hero destinations are anchors and hero actions are buttons · missing media degrades to a labelled placeholder with no `<img>` · 19 `sr-only` elements stay inside a 320px document · the primary call to action shows a 2px focus outline · the composition has one `h1` and no skipped heading levels · no nested horizontal scrolling · a consumer surface override reaches both the footer ground and the control.

### Release gates

| Gate | Status |
|---|---|
| 1. Visual review | **Pass.** Screenshots inspected at 1440 and 390 in both modes, plus the 320px long-label footer, the dark 320px hero with missing media, and the 420px narrow composition. Three defects found this way and fixed: German compounds broke mid-word in a two-column footer at 320px (the group grid now starts at one column and adds the second at 420px); a forced aspect ratio with `object-cover` cropped product screenshots (media now keeps its natural proportions by default); and a trailing badge squeezed a long link label (footer links now wrap the badge below the text). |
| 2. Responsive review | **Pass.** 312 checks at the four widths in both modes, a narrow parent container on a wide viewport, and 200% root text sizing, all without horizontal overflow. |
| 3. Semantics and keyboard | **Pass for what was tested.** 156 axe scans clean; radio-group and disclosure keyboard flows exercised; focus ring measured; heading outline asserted. No screen-reader pass was performed. |
| 4. Contrast and targets | **Pass.** 0 axe contrast violations in either mode at both widths. The period switch target measures 147×38px. Target size was not measured exhaustively for every control. |
| 5. Theming | **Pass.** Light, dark, a consumer brand override applied per mode, and a `.rayden-light` island inside a dark document are all covered by stories and included in the clean scans. A surface override was measured reaching both the footer ground and the native select. |
| 6. Interaction checks | **Pass.** 18 real behavioural assertions, not render smoke tests. |
| 7. Distribution | **Not met.** These blocks are not exported from `src/blocks/index.ts`, have no catalog or AI metadata entry, and have no documentation page. All three are deliberate: export wiring is handled separately, and the four blocks introduce no optional dependency. |

### Known limitations

- **The repository's own Storybook vitest runner could not be executed.** `pnpm exec vitest run` discovers all five new story files but fails to launch, because the default Playwright browser binary (`chromium_headless_shell-1208`) is not installed — the same limitation the September audit recorded. Installing it needs a system change outside this batch, and the runner's browser cannot be redirected to installed Chrome without editing `vitest.config`. Everything above was therefore measured through a standalone harness driving installed Google Chrome. Discovery of the five files does confirm they are valid CSF modules.
- No screen-reader pass, no non-Chromium engine, and no operating-system text-size or full-browser-zoom test.
- Target size was measured for the period switcher only.
- The stories use inline SVG data URIs for product imagery so they render identically offline; real photographic assets were not exercised.
- Story fixtures were rendered in a standalone Vite harness, not through Storybook's own runtime. The harness needed an explicit `@source` for `src/blocks`, because Tailwind's automatic source detection starts from the harness root; without it, block-only utilities such as `bg-surface-muted` were silently absent. Any future harness outside the repository needs the same declaration.

## Findings for other owners

These were observed while building Batch A and are outside its scope.

1. **`Button` has no polymorphic escape hatch.** A destination styled as a button has to be hand-rolled as an `<a>`, because `Button` always renders `<button>`. All four blocks therefore carry a local call-to-action recipe that mirrors `Button`'s tokens, which is duplication that will drift. An `as` or `asChild` prop on `Button` would remove it from every future marketing block.
2. **`Select`, `Alert`, `Chip`, and `Divider` still hard-code `bg-white dark:bg-grey-50`** and so do not follow a consumer's `--color-surface`. This is audit finding B07 in components rather than blocks. The footer works around it with a native select; the pricing notice is rendered locally rather than with `Alert` for the same reason.
3. **The library's `border-grey-300` input border measures 1.39:1 against a light ground**, below the 3:1 WCAG 1.4.11 asks of a control boundary. axe does not test 1.4.11, so this will not surface in automated scans. Worth a deliberate decision at the token level rather than per block.
4. **There is no paired foreground role.** `--color-surface` has border and muted-ground partners but no `--color-on-surface` family, so text on a custom surface still relies on the grey scale being appropriate for it. The batch works within this; a consumer choosing a mid-tone brand surface would have no supported way to correct the foreground.
