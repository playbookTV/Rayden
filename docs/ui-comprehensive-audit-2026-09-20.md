# Rayden UI — comprehensive audit, 20 September 2026

## Anti-pattern verdict

**The calm, approachable direction fits broad product teams, but execution is inconsistent.** The main problems are broken contracts, missing feedback and incomplete state handling. Repeated orange/white combinations, faint metadata and inconsistent theme pairs undermine readability. Some starter pages still use generic card grids and inert calls to action. A decorative redesign would not solve the release issues below.

## Result

**47 prioritized findings: 21 P1 major, 25 P2 minor/integration or quality gaps, and 1 P3 polish item. No P0 finding was confirmed.** This consolidates the eight open findings from the previous audit without counting them twice. Findings are grouped by actionable cause; raw automated flags and repeated snippet occurrences are not counted as separate product defects. HeaderBlock is identified separately as an unexported prototype.

The release priorities are the broken blocks import, optional dependencies that break root imports, initial-modal server crashes, missing documentation search, incompatible documentation/starter examples, keyboard/focus failures, and unreadable or unnamed content.

| Dimension | Score / 4 | Evidence |
|---|---:|---|
| Accessibility | 1 | Hidden focus, unnamed progress/chart controls, lost form errors, repeated contrast failures |
| Performance | 2 | Small consumer imports meet their budget; documentation’s shared payload remains large |
| Responsive design | 2 | Documentation shell fits phones; banner content and table toolbar fail, and many fixtures are fixed width |
| Theming | 1 | Tokens exist, but incompatible foreground/surface pairs and persistence defects remain |
| Anti-patterns | 3 | A suitable visual direction; incomplete interactions and generic starter scaffolds reduce confidence |
| **Total** | **9/20** | **Poor under the skill rubric; substantive repair needed** |

This is a heuristic over a broader scope than earlier reviews, not a measured deterioration or a WCAG certification.

## Coverage and evidence

- Inspected the core component catalog, eight block implementations (including the internal HeaderBlock), shared styles, form adapters, documentation contracts, packaging, quality configuration and starter UI usage.
- Ran all **281 existing stories across 43 files** through axe in light and dark themes at the actual **1200px** Storybook viewport and again at a verified **390px** viewport: **1,124 story/theme/viewport scans**. Desktop scans flagged 132 distinct stories; mobile scans flagged 123. These are automated signals, not 132 independent defects. Portaled content outside the canvas and interactions not exercised by a story require separate checks.
- Visited **all 49 pages linked by the documentation sidebar** at **1280×900** and **390×844**. All loaded with one h1, no page-wide horizontal overflow and no failed main-content images observed on the desktop pass. This does not mean every preview was unclipped. Search was exercised separately and failed.
- Inspected JSX usage across **24 starter combinations**: six templates × two frameworks × two languages. Performed targeted UI type checking of all 12 TypeScript combinations against the current library: **16 relevant errors in 10 files**. This was not a fresh install/build of every standalone starter; unrelated framework dependency-resolution diagnostics were outside that check.
- Checked direct JSX prop names and literal values in all documentation code fences against component types: **109 mismatches on 17 pages**. This bounded check does not compile arbitrary surrounding variables, callbacks, spread props or nested object shapes. The earlier form-control callback compilation is additional evidence.
- **11 temporary browser diagnostic stories reproduced 11 defects**: theme default, custom storage key, grouped-button submission, fake sorting, stale selection, ignored header href, lost nested errors, ineffective native options, popover focus theft, offscreen tooltip and empty modal action. They passed because they asserted the bad behavior. Probes and temporary scan configuration were removed.
- Isolated-package loading reproduced the missing blocks export and missing optional chart peer; a server render reproduced the initially open modal crash.
- Final unchanged-library checks: **281/281 normal tests passed**, type checking passed; Button initial gzip **9,542 bytes**, static Icon + home icon **9,897 bytes**, each below its 15,000-byte budget. No implementation fixes were made during this audit.
- Graph-first inventory returned 176 TSX files and 185 TS/JSX files without further pagination. Coverage was checked for the relevant source paths and documentation/template scopes. Matching metadata was observed; graph generations changed during the session, with supplemental coverage at `2026-09-20T19:49:42Z`. Partial Card story ranges and the two CSS parse-gap regions were read directly. MDX and configuration checks used source inspection. Graph coverage remains best effort, not proof of completeness.

Evidence files:

- [Complete story coverage matrix](/Users/leslieisah/app-dev/Rayden/docs/ui-audit-evidence-2026-09-20/story-coverage.csv)
- [Desktop axe findings, nodes and incomplete checks](/Users/leslieisah/app-dev/Rayden/docs/ui-audit-evidence-2026-09-20/desktop-accessibility.json)
- [Mobile axe findings and overflow measurements](/Users/leslieisah/app-dev/Rayden/docs/ui-audit-evidence-2026-09-20/mobile-accessibility.json)
- [All 109 documentation prop/value mismatches](/Users/leslieisah/app-dev/Rayden/docs/ui-audit-evidence-2026-09-20/documentation-contracts.json)
- [All 16 targeted starter type errors](/Users/leslieisah/app-dev/Rayden/docs/ui-audit-evidence-2026-09-20/template-type-errors.json)

## Confirmed findings

### 01. [P1] The documented blocks import cannot resolve

**Packaging / onboarding** · [package.json](/Users/leslieisah/app-dev/Rayden/package.json:9)

All seven published block guides import from `@raydenui/ui/blocks`, but the package has no `./blocks` export. Blocks are also absent from the root exports. An isolated consumer reproduced `ERR_PACKAGE_PATH_NOT_EXPORTED`; the documentation demos bypass this using local source imports. This blocks the advertised adoption path.

**Fix:** Publish the blocks entry, declarations, and export mapping; test the exact documented import from a packed package. **Suggested pass:** `/harden`.

### 02. [P1] Optional chart dependencies are required by the root import

**Packaging / reliability** · [index.ts](/Users/leslieisah/app-dev/Rayden/src/index.ts:70)

With React and the declared regular dependencies installed, importing the package root fails with `ERR_MODULE_NOT_FOUND: chart.js`. The root eagerly re-exports Chart, while chart.js and react-chartjs-2 are marked optional. A bundler can remove unused code, but direct Node/SSR module loading still evaluates the dependency graph.

**Fix:** Isolate charts behind a subpath or otherwise prevent optional peers from being evaluated by unrelated imports. Test a consumer with no chart packages. **Suggested pass:** `/optimize`.

### 03. [P1] An initially open modal crashes server rendering

**Reliability / SSR** · [Modal.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Modal/Modal.tsx:308)

`renderToString(<Modal open ... />)` reproduced `ReferenceError: document is not defined`. The open render accesses document.body before mounting. This can break an initial welcome, confirmation, or deep-linked dialog in a server-rendered application.

**Fix:** Guard portal creation until a browser container exists and test initially open as well as closed server renders. **Suggested pass:** `/harden`.

### 04. [P1] Documentation search is broken in the production preview

**Navigation / documentation** · [package.json](/Users/leslieisah/app-dev/Rayden/packages/docs/package.json:7)

Searching for “Accordion” at localhost:3001 ends with “Failed to load search index” and a failed import of `/_pagefind/pagefind.js`. The build script runs Next only. Readers cannot search the component reference.

**Fix:** Generate and serve the search index as part of the production build, then smoke-test an actual query. **Suggested pass:** `/harden`.

### 05. [P1] Documentation examples and prop tables describe a different API

**Documentation correctness** · [metrics-card.mdx](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/metrics-card.mdx:24)

The direct JSX contract scan found 109 unsupported prop/value occurrences across 17 pages. Examples include MetricsCard variant/change/trend, EmptyStateIllustration variant/string sizes instead of required name/numeric size, SidebarMenu href and invalid nesting props, TableBlock columns/cells/pagination, SearchableTableBlock data/onSort/filters, and unsupported icon names. The earlier Checkbox/Toggle boolean-callback error adds another affected page. These are adoption failures, not stylistic preferences. The appendix lists every direct-prop finding; required props, nested objects and callbacks need additional compilation checks.

**Fix:** Regenerate examples and tables from current component types, compile complete snippets, and make live previews use the same source as their copyable example. **Suggested pass:** `/clarify`.

### 06. [P1] Starter templates contain reproducible UI contract errors

**Starter reliability** · [Dashboard.tsx](/Users/leslieisah/app-dev/Rayden/packages/create-rayden-app/templates/vite/dashboard/typescript/src/pages/Dashboard.tsx:13)

A targeted TypeScript check across all 12 TypeScript template combinations found 16 UI errors in 10 files. Both frameworks have numeric MetricsCard variation where strings are required, boolean setters passed to native Toggle events, invalid Select required/native-event usage, and the nonexistent monitor icon in landing pages. JavaScript copies repeat these patterns. Numeric variation matches none of MetricsCard’s string branches, producing empty cards; clicking a native option in the custom Select was separately reproduced as not selecting it.

**Fix:** Repair all framework/language copies together. Use SelectOption/onValueChange, native event.target.checked, valid variation strings and icon names. Build and exercise each generated starter. **Suggested pass:** `/harden`.

### 07. [P1] Collapsed accordion content still receives keyboard focus

**Accessibility** · [Accordion.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Accordion/Accordion.tsx:266)

Carried forward from the previous audit: Tab moved from an expanded=false trigger into a button inside its visually collapsed panel. Grid height and clipping do not hide descendants from focus or assistive technology.

**Fix:** Coordinate hidden/inert semantics with the collapse animation; test closing while focus is inside. **Suggested pass:** `/harden`.

### 08. [P1] Collapsed sidebar navigation loses destinations and names

**Accessibility / navigation** · [SidebarMenuItem.tsx](/Users/leslieisah/app-dev/Rayden/src/components/SidebarMenu/SidebarMenuItem.tsx:125)

Carried forward: activating a collapsed expandable item does nothing and its children are unavailable. A React-node label such as <span>Home</span> also yields an unnamed compact item because naming only handles string children. Compact navigation is functionally incomplete.

**Fix:** Provide an accessible flyout or expand the sidebar, and require a reliable compact label for every destination. **Suggested pass:** `/adapt`.

### 09. [P1] The password reveal control is hidden from assistive technology

**Accessibility** · [LoginBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/LoginBlock.tsx:202)

LoginBlock places a focusable, unnamed eye button inside Input’s decorative trailingIcon slot, whose wrapper is aria-hidden=true. Axe flags aria-hidden-focus in all three login examples in both themes. Keyboard focus can enter a control that screen readers cannot identify.

**Fix:** Use an interactive addon slot and an explicit Show password/Hide password name and state; keep decorative icon wrappers noninteractive. **Suggested pass:** `/harden`.

### 10. [P1] TableBlock row actions and selection controls are unnamed

**Accessibility** · [TableBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/TableBlock.tsx:76)

Axe confirms unnamed row/select-all checkboxes and unnamed kebab buttons. Empty action column headers also occur in TableBlock, SearchableTableBlock and table examples. A screen-reader user cannot reliably identify which row an action affects.

**Fix:** Name selection and action controls using the row identity, and provide a visually hidden Actions column heading. **Suggested pass:** `/harden`.

### 11. [P1] Progress indicators do not expose their visible labels

**Accessibility** · [ProgressBar.tsx](/Users/leslieisah/app-dev/Rayden/src/components/ProgressBar/ProgressBar.tsx:67)

ProgressBar puts role=progressbar on an inner element but spreads aria-label onto the outer wrapper; the visible label is not connected. Every ProgressBar example fails the naming check, and FileUpload inherits the problem. ProgressCircle examples also omit names, although its root does accept aria-label. Across desktop theme scans there are 38 story/theme naming flags.

**Fix:** Attach naming props and value semantics to the same progress element. Connect visible labels and give each upload a filename-specific progress name. **Suggested pass:** `/harden`.

### 12. [P1] Charts have no accessible data alternative

**Accessibility / data comprehension** · [Chart.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Chart/Chart.tsx:187)

All nine chart examples trigger role-img-alt in both themes: the rendered canvas has no accessible name. The wrapper offers no forwarded canvas description or fallback data table. Users who cannot interpret the canvas lose the information, not just decoration.

**Fix:** Expose an accessible chart title/summary and an equivalent data table or meaningful text alternative; forward appropriate canvas accessibility props. **Suggested pass:** `/harden`.

### 13. [P1] Shared accent and muted text colors repeatedly fail contrast

**Accessibility / theming** · [globals.css](/Users/leslieisah/app-dev/Rayden/src/styles/globals.css:36)

The desktop scan flags contrast in 136 story/theme combinations. Confirmed recurring pairs include white on primary-400 at 3.07:1, white on primary-500 at 3.68:1, and grey-400 on white at 2.57:1. Affected content includes Badge, active ButtonGroupItem, NumberCounter, Breadcrumb’s current page, Divider labels, ActivityFeed metadata/actions, MetricsCard context, Stepper labels and block links. Normal text needs 4.5:1. Raw scan totals also include fixture and disabled-state flags, which are not all independent component violations.

**Fix:** Replace ad hoc palette choices with tested foreground/surface pairs for text, badges, metadata and actions. Validate every status and theme. **Suggested pass:** `/colorize`.

### 14. [P1] Literal surfaces and text break dark mode

**Theming / accessibility** · [Banner.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:47)

Banner’s information title measures 1.03:1 on its pale surface; its feature title is literal black. EmptyStateBlock headings and RecentTransactionsBlock amounts are also black on a dark surface at 1.19:1. Numbered Accordion badges combine white text with a grey token that becomes pale. Chip’s literal pale focus background similarly conflicts with adaptive text. These are core component color-pair defects; pale custom story backgrounds are tracked separately.

**Fix:** Use paired semantic tokens for each surface/state and remove literal black/white assumptions from adaptive themes. **Suggested pass:** `/colorize`.

### 15. [P1] SearchableTableBlock claims to sort without sorting

**Data integrity / interaction** · [SearchableTableBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/SearchableTableBlock.tsx:110)

A browser probe clicked Name: aria-sort changed to ascending, but the rows remained Zelda then Alice. handleSort changes only local indicators; rendering still maps the original rows, and there is no exposed sort callback. Users are given an incorrect description of the data order.

**Fix:** Implement sorting or expose a controlled sort contract that updates rows and indicators together. Test actual row order. **Suggested pass:** `/harden`.

### 16. [P1] ButtonGroupItem unexpectedly submits surrounding forms

**Form reliability** · [ButtonGroupItem.tsx](/Users/leslieisah/app-dev/Rayden/src/components/ButtonGroup/ButtonGroupItem.tsx:18)

The native button has no default type. A diagnostic form submitted when its Monthly group item was clicked. This differs from the corrected Button behavior and can submit incomplete or unintended data.

**Fix:** Default to type=button while preserving an explicit submit override, and test grouped controls inside forms. **Suggested pass:** `/harden`.

### 17. [P1] Interactive tooltip rerenders steal focus while typing

**Accessibility / form reliability** · [Tooltip.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Tooltip/Tooltip.tsx:94)

In a reproduced popover containing a controlled Note input, entering the first character rerendered the parent and moved focus from the input back to the dialog. The focus effect depends on children and callback identities, so ordinary rerenders refocus the panel.

**Fix:** Focus on the closed-to-open transition only; keep live callbacks in refs where needed. Test multi-character typing and parent rerenders while the popover is open. **Suggested pass:** `/harden`.

### 18. [P1] Form adapters lose nested-field errors

**Form validation** · [useRaydenInput.ts](/Users/leslieisah/app-dev/Rayden/src/hooks/form/useRaydenInput.ts:44)

Both input and select adapters index errors with the complete field path string. For profile.email, React Hook Form stores nested objects instead. A probe with an existing Required error returned hasError=false, hiding why submission failed.

**Fix:** Use a nested-path resolver or the form library’s field-state API. Cover nested objects and field arrays. **Suggested pass:** `/harden`.

### 19. [P1] The select adapter returns errors that Select cannot display

**Form validation / accessibility** · [useRaydenSelect.ts](/Users/leslieisah/app-dev/Rayden/src/hooks/form/useRaydenSelect.ts:62)

useRaydenSelect returns error and hasError, but Select has no error prop, error rendering or invalid-state wiring. Spreading the advertised adapter into Select silently loses even flat-field validation feedback; the extra properties land on a div.

**Fix:** Give Select a defined error contract and associated error text/aria-invalid, and make the adapter return only supported props. **Suggested pass:** `/harden`.

### 20. [P1] Banner clipping hides notification content on phones

**Responsive design** · [Banner.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:175)

Carried forward and visible in the full documentation crawl: at 390px the Update available banner had 538px of content in a 308px-wide, fixed-height clipped container. The page itself did not overflow, so page-width checks alone miss the loss.

**Fix:** Allow content-driven height and wrapping; reserve space for dismissal/actions without hiding important copy. **Suggested pass:** `/adapt`.

### 21. [P1] The search-table toolbar exceeds phone width

**Responsive design** · [SearchableTableBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/SearchableTableBlock.tsx:182)

At a verified 390px viewport, the With Search example reaches 505px. The toolbar combines a 260px input, filter button and optional date action in nonwrapping rows. The table has a scroll wrapper, but the toolbar is outside it.

**Fix:** Wrap or stack toolbar controls according to available container width; let the search field shrink. **Suggested pass:** `/adapt`.

### 22. [P2] Theme defaults and custom persistence keys are ignored

**Theming / state** · [ThemeContext.tsx](/Users/leslieisah/app-dev/Rayden/src/context/ThemeContext.tsx:63)

Two browser probes confirmed defaultTheme=dark becomes system when storage is empty, and a dark value under a custom storageKey is ignored. getStoredTheme always returns a truthy system fallback and always reads the fixed key, while writes use the custom key.

**Fix:** Read the supplied key and distinguish no stored preference from a stored system preference. **Suggested pass:** `/harden`.

### 23. [P2] Table selection becomes misleading after row changes

**State / accessibility** · [SearchableTableBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/SearchableTableBlock.tsx:122)

After selecting Alice and replacing the rows with Bob, the probe showed Select all checked while Bob was unchecked. Both table blocks compare selection count rather than membership and retain stale IDs. Partial selection is also rendered as fully checked rather than mixed.

**Fix:** Reconcile selection against the intended row scope, derive allSelected by membership, and expose an indeterminate/mixed header checkbox. **Suggested pass:** `/harden`.

### 24. [P2] Title-table Search and Sort buttons do nothing

**Interaction** · [SearchableTableBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/SearchableTableBlock.tsx:146)

The title toolbar’s Search and Sort buttons have explicit empty handlers and no callback API. Unlike a consumer-owned optional action, these cannot be wired through the published props. The input toolbar forwards search text but does not filter rows itself, which also needs clear documentation.

**Fix:** Implement the toolbar actions or expose callbacks; state whether search/filtering is local or consumer-controlled. **Suggested pass:** `/harden`.

### 25. [P2] Adding an accordion click callback disables expansion

**Interaction contract** · [Accordion.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Accordion/Accordion.tsx:209)

Carried forward: spreading rest after the internal onClick allows an analytics or integration callback to replace the toggle. The earlier browser probe confirmed the callback ran but expansion did not.

**Fix:** Compose handlers and define cancellation semantics instead of replacing the internal action. **Suggested pass:** `/harden`.

### 26. [P2] Counter starts outside its configured range

**State** · [Counter.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Counter/Counter.tsx:107)

Carried forward: Counter min=5 max=10 displays 0 initially, then jumps to 5 on the first increase. Only update-time values are clamped.

**Fix:** Normalize uncontrolled initialization and changed bounds; document invalid controlled-value behavior. **Suggested pass:** `/harden`.

### 27. [P2] Banner displays a close control without close behavior

**Interaction** · [Banner.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:152)

Carried forward: dismissible defaults true while onDismiss is optional. Without a callback, the close control remains visible and does nothing, including in documented examples.

**Fix:** Hide unavailable dismissal, require its callback, or provide a documented uncontrolled dismissal mode. **Suggested pass:** `/harden`.

### 28. [P2] Modal can render inert or empty primary actions

**Interaction / accessibility** · [Modal.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Modal/Modal.tsx:108)

Save is supplied by default even when onPrimaryClick is absent. A new browser probe also confirmed primaryLabel="" with secondaryLabel="Cancel" still produces a third, empty primary button because the footer condition controls the whole footer, not that button.

**Fix:** Render each action only when configured, and make default action behavior explicit. **Suggested pass:** `/harden`.

### 29. [P2] Modal description can reference content that is not rendered

**Accessibility / content** · [Modal.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Modal/Modal.tsx:223)

With description supplied, no title and showClose=false, the whole header is omitted although aria-describedby still references the description ID. The explanatory copy disappears and the relationship points nowhere.

**Fix:** Render descriptions independently of title/close visibility and only reference mounted descriptions. **Suggested pass:** `/harden`.

### 30. [P2] An open modal can retain a stale theme

**Theming** · [Modal.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Modal/Modal.tsx:136)

The portal copies its nearest theme class only when open changes. If the theme changes while the modal remains open, that copied class can keep the dialog in its old theme even after the root changes.

**Fix:** Synchronize portal theme context during theme changes or inherit a stable semantic theme container. **Suggested pass:** `/colorize`.

### 31. [P2] Remember me has no effect on the login contract

**Form behavior / copy** · [LoginBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/LoginBlock.tsx:122)

The visible “Remember me for 30 days” checkbox updates internal state, but that value is never passed to onSubmit or exposed through a callback. The integrator cannot honor the preference through the advertised API.

**Fix:** Expose rememberMe in the submission/controlled contract and avoid promising a fixed duration the component cannot implement. **Suggested pass:** `/clarify`.

### 32. [P2] Login fields omit basic validation and submission states

**Forms / usability** · [LoginBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/LoginBlock.tsx:188)

The email field is type=text; neither credential is required. The submit callback accepts blank values. There are no props for pending state, a server error, or disabled submission. Consumers can validate externally, but the block cannot present the outcome through its intended interface.

**Fix:** Use email/password autocomplete and required semantics as appropriate, and expose pending/error state without hardcoding authentication policy. **Suggested pass:** `/harden`.

### 33. [P2] Work-email login misnames custom identity providers

**Content correctness** · [LoginBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/LoginBlock.tsx:166)

The work-email variant uses the first custom provider’s icon and callback but always labels it Continue with Google. Supplying Microsoft or another provider creates a misleading sign-in action.

**Fix:** Use the configured provider name and define whether the variant accepts one provider or many. **Suggested pass:** `/clarify`.

### 34. [P2] Avatar status is communicated only visually

**Accessibility** · [Avatar.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Avatar/Avatar.tsx:103)

Online/offline dots and the verified badge have no accessible status text. The avatar alt describes the person, not these separately supplied states. People using assistive technology lose presence and verification information.

**Fix:** Expose a short status description when meaningful, and allow explicitly decorative status usage. **Suggested pass:** `/harden`.

### 35. [P2] Button group active state is visual only

**Accessibility** · [ButtonGroupItem.tsx](/Users/leslieisah/app-dev/Rayden/src/components/ButtonGroup/ButtonGroupItem.tsx:14)

The active prop changes colors but does not expose pressed/selected state. A user navigating without vision cannot determine the chosen view or period from the component’s state contract.

**Fix:** Define whether the group is a toggle group, single choice or navigation, then implement corresponding semantics and keyboard behavior. **Suggested pass:** `/harden`.

### 36. [P2] Stepper status is not exposed programmatically

**Accessibility / progress** · [Stepper.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Stepper/Stepper.tsx:173)

Active/completed/disabled states are represented by color and icon styling without an accessible current-step/status description. The linear and segmented variants also lose progress information when showLabel=false because the visual bars have no value semantics.

**Fix:** Expose current step and status text; provide named progress semantics where the component represents measurable progress. **Suggested pass:** `/harden`.

### 37. [P2] Read-only inputs lose the visible focus treatment

**Keyboard usability** · [Input.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Input/Input.tsx:141)

Source inspection shows the standard read-only branch uses a static background/border while the native input has outline-none. The usual focus-within border class is excluded. Read-only inputs remain keyboard-focusable for selection and copying, so users need a visible focus position.

**Fix:** Apply a consistent focus-visible treatment independently of editability; verify keyboard text selection. **Suggested pass:** `/harden`.

### 38. [P2] Small icon targets are difficult to use by touch

**Responsive usability** · [Chip.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Chip/Chip.tsx:49)

Chip close/filter controls are 16×16px. Several close and row-action controls are 24–32px. These are much smaller than a comfortable 44px touch area. This is a usability finding, not an automatic WCAG failure: the 24px minimum criterion includes spacing exceptions.

**Fix:** Increase invisible hit areas or padding while preserving compact visuals; verify adjacent controls do not overlap. **Suggested pass:** `/adapt`.

### 39. [P2] Motion does not respect reduced-motion preferences

**Accessibility preference / motion** · [Spinner.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Spinner/Spinner.tsx:49)

Spinner uses indefinite spin/dash/juggle animations and core styles contain no reduced-motion override. Progress and collapse transitions likewise have no shared preference policy. Some essential progress motion may be exempt from a particular criterion, but the library currently offers no calmer default for users requesting it.

**Fix:** Provide reduced-motion variants and meaningful static loading text; retain only essential motion. **Suggested pass:** `/animate`.

### 40. [P2] Overlay placement can put content outside the viewport

**Responsive overlays** · [Tooltip.tsx](/Users/leslieisah/app-dev/Rayden/src/components/Tooltip/Tooltip.tsx:229)

A diagnostic tooltip anchored at the viewport’s top edge rendered above the visible screen. Placement uses fixed absolute offsets without collision detection or fallback. DropdownMenu and Select use similar fixed anchored positioning; those implementations were source-reviewed, not separately edge-probed.

**Fix:** Add measured collision handling and a constrained scrollable panel where needed; test all four screen edges. **Suggested pass:** `/adapt`.

### 41. [P2] Every documentation page carries a large shared client payload

**Performance** · [mdx-components.tsx](/Users/leslieisah/app-dev/Rayden/packages/docs/mdx-components.tsx:96)

The existing production app manifest’s shared layout plus documentation route references 12 unique JavaScript chunks: 6,059,477 raw bytes and 2,079,426 bytes when individually gzipped. The global MDX map eagerly references the component catalog and demos. This is an artifact-size measurement, not measured transfer time, Core Web Vitals or a Lighthouse result.

**Fix:** Split heavy demos, charts and illustration catalogs by page or defer them until requested. Add a documentation payload budget. **Suggested pass:** `/optimize`.

### 42. [P2] Story fixtures hide or introduce accessibility and mobile problems

**Quality / example design** · [DropdownMenu.stories.tsx](/Users/leslieisah/app-dev/Rayden/src/components/DropdownMenu/DropdownMenu.stories.tsx:28)

Examples contain unnamed icon buttons, hardcoded pale/dark backgrounds and duplicated landmark names. At 390px, 48 stories overflow, many because of fixed-width wrappers (Accordion 750px, QuickSend 695px, Notifications 460px). These are fixture defects or review signals, not proof those components themselves cannot resize. They make copyable examples unreliable and contaminate theme scans.

**Fix:** Use fluid isolated fixtures, explicit accessible names and deliberate theme boundaries. Keep multi-variant showcase exceptions separate from default usage examples. **Suggested pass:** `/adapt`.

### 43. [P2] The normal quality gate misses the defects in this report

**Quality coverage** · [quality.yml](/Users/leslieisah/app-dev/Rayden/.github/workflows/quality.yml:23)

The unchanged normal suite passes all 281 tests despite the confirmed issues. Most stories are render examples; strict accessibility is enabled only for the interaction-regression set. CI does not compile documentation snippets, validate generated starter variants, test optional-peer consumers or initially open server-rendered portals.

**Fix:** Add a small set of representative acceptance checks for these contracts, expand themed accessibility coverage, and check packed consumers and generated templates. **Suggested pass:** `/audit`.

### 44. [P2] HeaderBlock is an unfinished internal prototype

**Internal block / navigation** · [HeaderBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/HeaderBlock.tsx:11)

HeaderBlock is deliberately commented out of the blocks index, so this is not a released import regression. Its href prop is ignored (browser-probed); variant 11 hides switcher and secondary links on mobile without restoring them in the menu; menu toggles omit expanded/controls state; switcher activeIndex is used only during initialization. These are gates before exposing it as a supported block.

**Fix:** Keep it explicitly experimental until navigation, mobile parity, state semantics and controlled updates are implemented. **Suggested pass:** `/shape`.

### 45. [P2] Unlabeled form controls discard className

**Component contract** · [Checkbox.tsx](/Users/leslieisah/app-dev/Rayden/src/components/FormControl/Checkbox.tsx:46)

Checkbox, Radio and Toggle remove className from rest and apply it only to the optional label wrapper. When no label/description is supplied, the early return drops the caller’s styles. This makes layout and focus customization depend unexpectedly on whether a label is present.

**Fix:** Define stable wrapper/input styling props and apply them in both labeled and compact modes. **Suggested pass:** `/harden`.

### 46. [P2] Several starter and block actions promise unavailable behavior

**Interaction / example copy** · [Settings.tsx](/Users/leslieisah/app-dev/Rayden/packages/create-rayden-app/templates/vite/dashboard/typescript/src/pages/Settings.tsx:58)

Dashboard Settings displays Change Avatar, Cancel and Save Changes without handlers; landing/blog CTAs and social signup defaults are similarly unwired. DatePicker Done can be shown without onDone, and Chip’s filter button can appear without onDropdown. Templates may intentionally need application wiring, but the visible experience and docs do not consistently distinguish demonstration from a completed flow.

**Fix:** Wire local demonstration behavior where useful, hide unavailable optional actions, and clearly document the integration points instead of presenting inert controls as working flows. **Suggested pass:** `/clarify`.

### 47. [P3] Quick Send’s default label contains a typo

**Copy polish** · [QuickSendBlock.tsx](/Users/leslieisah/app-dev/Rayden/src/blocks/QuickSendBlock.tsx:33)

The default action reads “See all beneficaries”. This is a small credibility issue in a reusable block.

**Fix:** Change the default to “See all beneficiaries” and check neighboring shared labels. **Suggested pass:** `/polish`.

## Documentation mismatch inventory

These are direct unsupported props/values, grouped by page. Repeated uses are retained in the evidence JSON so each occurrence can be corrected. The form-control callback mismatch is also open but is not included in the 109 count.

| Page | Occurrences | Unsupported usage |
|---|---:|---|
| [index](/Users/leslieisah/app-dev/Rayden/packages/docs/content/blocks/index.mdx:1) | 2 | `TableBlock.columns`; `TableBlock.title` |
| [login-block](/Users/leslieisah/app-dev/Rayden/packages/docs/content/blocks/login-block.mdx:1) | 1 | `LoginBlock.onSocialLogin` |
| [searchable-table-block](/Users/leslieisah/app-dev/Rayden/packages/docs/content/blocks/searchable-table-block.mdx:1) | 9 | `Button.destructive`; `SearchableTableBlock.data`; `SearchableTableBlock.filters`; `SearchableTableBlock.onFilterChange`; `SearchableTableBlock.onSort`; `SearchableTableBlock.pagination` |
| [table-block](/Users/leslieisah/app-dev/Rayden/packages/docs/content/blocks/table-block.mdx:1) | 10 | `TableBlock.columns`; `TableBlock.description`; `TableBlock.onRowClick`; `TableBlock.pagination`; `TableBlock.title` |
| [activity-feed](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/activity-feed.mdx:1) | 12 | `ActivityItem.actions`; `ActivityItem.icon`; `ActivityItem.timestamp`; `Icon.name="alert-circle"` |
| [alert](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/alert.mdx:1) | 2 | `Alert.actions`; `Alert.onDismiss` |
| [avatar](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/avatar.mdx:1) | 2 | `Avatar.status="away"`; `Avatar.status="busy"` |
| [badge](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/badge.mdx:1) | 3 | `Badge.dot`; `Tab.label` |
| [button-group](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/button-group.mdx:1) | 2 | `ButtonGroupItem.icon` |
| [card](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/card.mdx:1) | 1 | `Icon.name="dots-horizontal"` |
| [chip](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/chip.mdx:1) | 2 | `Chip.avatar`; `Chip.focused` |
| [divider](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/divider.mdx:1) | 3 | `Divider.buttonText`; `Divider.orientation` |
| [empty-state-illustration](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/empty-state-illustration.mdx:1) | 17 | `EmptyStateIllustration.primaryColor`; `EmptyStateIllustration.secondaryColor`; `EmptyStateIllustration.variant` |
| [icon](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/icon.mdx:1) | 1 | `Icon.name="x-circle"` |
| [metrics-card](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/metrics-card.mdx:1) | 22 | `Icon.name="currency-dollar"`; `MetricsCard.change`; `MetricsCard.changeType`; `MetricsCard.progress`; `MetricsCard.subtitle`; `MetricsCard.trend`; `MetricsCard.variant` |
| [select](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/select.mdx:1) | 3 | `SelectOption.status` |
| [sidebar-menu](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/sidebar-menu.mdx:1) | 17 | `SidebarMenu.theme="dark"`; `SidebarMenuItem.href`; `SidebarMenuSub.icon`; `SidebarMenuSub.label`; `SidebarMenuSubItem.href` |

## Story scan overview

Counts are story/theme cases at desktop width. “No flag” means only that this automated snapshot returned no violation; it does not prove accessibility or functional correctness. The CSV includes every story at both widths.

| Story group | Stories | Flagged cases / theme scans | Rules flagged |
|---|---:|---:|---|
| Blocks/EmptyState | 3 | 3 / 6 | color-contrast |
| Blocks/Header | 11 | 22 / 22 | color-contrast |
| Blocks/Login | 3 | 6 / 6 | aria-hidden-focus, color-contrast |
| Blocks/Notifications | 1 | 2 / 2 | color-contrast |
| Blocks/QuickSend | 1 | 1 / 2 | color-contrast |
| Blocks/RecentTransactions | 1 | 2 / 2 | color-contrast |
| Blocks/SearchableTable | 2 | 4 / 4 | empty-table-header |
| Blocks/Table | 1 | 2 / 2 | button-name, color-contrast, empty-table-header, label |
| Components/Accordion | 8 | 12 / 16 | color-contrast, landmark-unique |
| Components/Alert | 3 | 1 / 6 | color-contrast |
| Components/Avatar | 7 | 0 / 14 | No flag |
| Components/Badge | 6 | 11 / 12 | color-contrast |
| Components/Banner | 7 | 10 / 14 | color-contrast |
| Components/Breadcrumb | 8 | 10 / 16 | color-contrast, landmark-unique |
| Components/Button | 14 | 0 / 28 | No flag |
| Components/ButtonGroup | 5 | 4 / 10 | color-contrast |
| Components/Card | 12 | 6 / 24 | button-name, color-contrast |
| Components/Chart | 9 | 18 / 18 | role-img-alt |
| Components/Chip | 3 | 2 / 6 | color-contrast |
| Components/Counter | 6 | 2 / 12 | color-contrast |
| Components/DatePicker | 7 | 0 / 14 | No flag |
| Components/Divider | 7 | 2 / 14 | color-contrast |
| Components/DropdownMenu | 7 | 6 / 14 | button-name, color-contrast |
| Components/EmptyStateIllustration | 5 | 0 / 10 | No flag |
| Components/FormControl | 3 | 0 / 6 | No flag |
| Components/Icon | 5 | 0 / 10 | No flag |
| Components/Input | 12 | 1 / 24 | color-contrast |
| Components/Pagination | 3 | 0 / 6 | No flag |
| Components/ProgressBar | 10 | 20 / 20 | aria-progressbar-name |
| Components/ProgressCircle | 7 | 14 / 14 | aria-progressbar-name |
| Components/Select | 10 | 0 / 20 | No flag |
| Components/Slider | 8 | 0 / 16 | No flag |
| Components/Spinner | 7 | 1 / 14 | color-contrast |
| Components/Stepper | 8 | 4 / 16 | color-contrast |
| Components/Table | 5 | 3 / 10 | color-contrast, empty-table-header |
| Components/Tabs | 9 | 2 / 18 | color-contrast |
| Components/Tooltip | 4 | 0 / 8 | No flag |
| Elements/ActivityFeed | 8 | 11 / 16 | color-contrast |
| Elements/FileUpload/DropZone | 7 | 6 / 14 | aria-progressbar-name, color-contrast |
| Elements/MetricsCard | 13 | 8 / 26 | color-contrast |
| Elements/Modal | 8 | 14 / 16 | color-contrast |
| Elements/SidebarMenu | 5 | 7 / 10 | button-name, color-contrast, landmark-unique |
| Quality/Interaction contracts | 12 | 0 / 24 | No flag |

## Interpretation and limits

- Multiple identical landmarks in a multi-example story are a fixture issue unless the same ambiguity occurs in a real composition. An unnamed icon supplied by a story is not automatically a defect in the generic Button primitive. Disabled-state contrast flags were not treated as blanket WCAG failures. Those raw results remain available for review.
- Fixed story wrappers account for many of the 48 mobile-overflow examples. QuickSend already has an internal horizontal scroller; its 695px demo wrapper is not evidence that the component itself needs one. Banner clipping and the SearchableTable toolbar were separately confirmed.
- Normal-text contrast is assessed against the [W3C minimum contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Keyboard disclosure recommendations follow the [accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) and [disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/). Optional arrow-key behavior was not misclassified as mandatory.
- This sweep did not establish screen-reader behavior with VoiceOver/NVDA, Safari/Firefox parity, real-device touch behavior, all 200–400% text/zoom states, RTL/localization, forced colors, every dynamic/async state, all overlay nesting combinations, every possible prop combination, security compliance or production Core Web Vitals. External authentication, checkout and messaging integrations were not executed.
- The AI/MCP package and CLI internals were not comprehensively audited as backend systems; starter UI and documented consumer contracts were the relevant scope. Existing product-vision/roadmap work was preserved.

## What is working

- The documentation hierarchy is easy to scan, and the homepage’s small product example communicates the intended use more clearly than a purely decorative showcase.
- The previously repaired Button, slider keyboard behavior, table sort control, date selection reset, tab defaults, file rejection flow and popup blur dismissal remain covered by passing regression checks.
- Native dialog use provides a sound basis for focus containment and background inertness once the remaining portal/state defects are resolved.
- Tables have a contained scroll region, pagination responds to available width, and QuickSend already scrolls its beneficiary list internally.
- The split static icon path and small-consumer bundle budgets provide useful protection. Preserve them when fixing packaging.
- Many controls already use stable IDs, native form inputs and semantic feedback tokens. Extend those patterns consistently rather than replacing the visual system.

## Recommended order

1. **P1 — `/harden`**: unblock published imports and server rendering; repair focus, validation, sorting, naming and selection contracts.
2. **P1 — `/clarify`**: restore search; correct documentation and starter usage together, then compile the examples consumers actually copy.
3. **P1 — `/colorize`**: establish tested foreground/surface pairs across statuses and both themes.
4. **P1/P2 — `/adapt`**: fix banner/toolbars and overlay edges, then make fixtures fluid and touch controls easier to hit.
5. **P2 — `/optimize`**: split documentation payloads and preserve the isolated consumer budgets.
6. **P2 — `/audit`**: rerun the expanded acceptance checks and accessibility matrix, including open overlays and screen-reader review.
7. **P3 — `/polish`**: finish copy, spacing, focus consistency and visual details after behavior is reliable.

These passes can be run one at a time, together, or in another order. Re-run `/audit` after repairs to evaluate the same coverage again.
