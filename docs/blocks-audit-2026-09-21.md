# Rayden blocks audit — 21 September 2026

## Verdict

**Good visual foundation; not ready for a blanket confirmation of responsiveness, semantics, or theming.** The seven public blocks have a coherent, restrained appearance. The internal Header needs more substantial work. Existing examples include narrow-layout, contrast, interaction-state, and theme defects that should be corrected before expanding the catalog.

Visual anti-pattern verdict: **pass on the overall direction**. The typography, orange accents, and restrained surfaces fit the confirmed calm, approachable brand. The main problems are concrete usability failures rather than a need for a new aesthetic. Desktop tables are orderly; the standard/card login and simple empty states translate well to dark mode. Notification metadata overlaps at narrow widths, and the fixed-width empty-state action wraps an ordinary two-word label awkwardly.

| Dimension | Score / 4 | Finding |
|---|---:|---|
| Accessibility and semantics | 2 | Native form/table foundations are good; contrast, misleading selection, and Header navigation remain defective. |
| Performance | 3 | Static source review found straightforward composition without an obvious layout-thrashing loop or expensive block animation. No fresh performance benchmark or bundle measurement was performed. |
| Responsive design | 2 | Several bounded layouts work; Header tablet overflow, notification collisions, and table scroll containment fail. |
| Theming | 2 | Light/dark tokens exist; semantic surface overrides and some explicit dark variants are inconsistent. |
| Visual/interaction anti-patterns | 3 | Consistent direction, weakened by inert controls, cramped metadata, and unrepresentative sample content. |
| **Total** | **12/20** | **Acceptable under the rubric, with significant work needed.** |

Scores are review heuristics, not certification. **13 grouped findings: 0 P0, 6 P1, 7 P2, 0 P3.** This is a bounded review of blocks and the shared components they directly expose, not a replacement for the whole-library audit.

## Scope and evidence

- **7 public exports** in `src/blocks/index.ts`; Header exists in source and stories but its export is commented out.
- **23 existing stories across 8 files passed** the normal browser test run. These block stories contain no `play` functions, so this result is a render baseline, not comprehensive behavioral coverage.
- **184 layout checks:** all 23 story fixtures × 320, 390, 768, and 1440 CSS-pixel widths × light/dark.
- **92 axe-core 4.11.1 scans:** all fixtures × 390/1440 × light/dark. **22 cases flagged contrast**, spanning 13 distinct stories. Repeated cases are not separate product defects.
- **34/184 fixture layout cases** had document-level horizontal overflow. These include wrapper effects and component defects; they must not all be attributed to block code.
- **69 additional bare-component layouts:** all 23 fixtures with their outer presentation wrappers removed, at 320/390/768 in light mode. Header overflow and the table problem persisted. Login-card and Recent Transactions fixture overflow did not persist.
- Targeted probes checked row replacement, partial selection, mobile links and menu relationships, hidden mobile features, pending login controls, custom surface overrides, filtered selection, and 200% root text sizing on five blocks.
- Visual inspection covered representative screenshots of all eight implementations, light/dark login and notifications, the work-email dark fixture, an explicit dark Header, and narrow table and empty-state examples. Capturing all fixtures does not mean every screenshot or every interactive state was manually inspected.

The initial live Storybook scanner encountered reloads and contention with its accessibility addon. Those interrupted runs are not the basis of the final counts. The completed scan rendered the **unchanged story render functions and their wrappers** in a separate Vite harness with a centred, padded host and an appropriate mode background. The bare pass used a normal full-width block host with 16px padding. These are controlled integration checks, not a claim that every documentation-page composition was tested.

The browser was installed Google Chrome driven by Playwright. The repository's default Playwright browser executable was unavailable; the successful normal suite used the existing executable-path override. No dependency installation was needed for this audit. Graph tools were unavailable, so source and runtime checks supplied the evidence; no graph coverage or freshness claim is made.

Evidence: [normal tests](block-audit-evidence-2026-09-21/normal-tests.log), [all fixture scans](block-audit-evidence-2026-09-21/story-scans.json), [bare layouts](block-audit-evidence-2026-09-21/bare-layouts.json), [targeted probes](block-audit-evidence-2026-09-21/targeted-probes.json), and [table overflow isolation](block-audit-evidence-2026-09-21/table-overflow.json).

## Block-by-block assessment

| Block | Visual and responsive assessment | Semantic and theme assessment | Readiness |
|---|---|---|---|
| Login | Card and standard forms are coherent. The card fixture is too padded at 320px, but the bare card fits. The work-email fixture breaks in dark mode. | Real form, associated labels, password control, autocomplete, error alert, and pending submit state. Remaining action/pending contracts need repair. | Targeted repairs |
| Notifications | Clear hierarchy at normal width; link/date/time metadata overlaps on phones. | Named section and article elements are useful. The richer feed role is incomplete; orange links fail light-mode contrast. | Repair before expansion |
| Table | Strong desktop hierarchy; the intended inner scroll region exists but a positioned hidden label causes page overflow. | Native table/header cells, named controls, and pagination are good. Select-all state becomes false information. | Repair before expansion |
| Searchable Table | Useful composition and wrapping toolbar. Shares the hidden-label overflow defect when actions are present. | Native sortable headers and meaningful labels. The filtered-selection probe passed. Filter/date callbacks and selection ownership need explicit contracts. | Targeted repairs |
| Quick Send | Compact, readable layout with deliberate recipient scrolling. Long handles remain inside a horizontal scroller in the tested case. | Buttons are keyboard reachable. Light-mode action contrast and semantic surface override fail. A beneficiary list would communicate structure better. | Targeted repairs |
| Recent Transactions | Direction, amount, and hierarchy are clear; long names truncate. The bare component fits tested widths; the fixed-width fixture does not always fit. | Visible “to/from” gives non-colour direction information. Light-mode link contrast and semantic surface override need repair. | Targeted repairs |
| Empty State | Clear and theme-consistent in inspected simple examples. “Upload Photos” wraps inside the fixed 135px action. | Native action button; illustration palette can be customised. Card surface and fixed heading/action sizing limit composability. | Closest to ready; polish/contracts |
| Header | Seven variants overflow at 768px; explicit dark variants can invert to a near-white surface in global dark mode. | Desktop anchors work when href is supplied; mobile links discard href, menu IDs do not resolve, and navigation landmarks/features are incomplete. | Keep internal |

## P1 — repair before release or expansion

### B01. Header loses navigation and features on mobile

Locations: [HeaderBlock.tsx:556](../src/blocks/HeaderBlock.tsx#L556), mobile rendering at [line 566](../src/blocks/HeaderBlock.tsx#L566), search at [line 529](../src/blocks/HeaderBlock.tsx#L529), and double-row rendering at [line 334](../src/blocks/HeaderBlock.tsx#L334).

At 390px, supplying Products/Pricing/About `href` destinations produced visible buttons and no visible links. The mobile renderer invokes only `onClick`, so href-only destinations cannot be reached. The expanded toggle's `aria-controls` points to an ID absent from the DOM. Variant 9 hides its search input without a mobile replacement; switcher and secondary destinations are also omitted in relevant mobile variants. No `nav` landmark is rendered.

Impact: mobile users lose actual destinations and functions, and assistive technology receives an invalid control relationship. Reuse the link-aware rendering on every viewport, connect a real menu ID, provide a labelled navigation landmark, and retain the desktop feature set in a mobile arrangement. Verify with href-only data and keyboard navigation. Suggested passes: `/harden`, `/adapt`.

### B02. Header switches to desktop layout before its contents fit

Locations: [HeaderBlock.tsx:510](../src/blocks/HeaderBlock.tsx#L510) and [globals.css:195](../src/styles/globals.css#L195).

Rayden's `md` breakpoint is 600px. At 768px, seven variants exceed the viewport; their measured document widths range from 881px to 1051px. The result persists without story wrappers. Large fixed padding, non-wrapping links, actions, and the 375px search input compete for space.

Impact: navigation is pushed off-screen on tablets and narrow desktop containers. Choose collapse behavior based on the actual composition/container width, reduce intermediate padding, and check all variants around the transition. Suggested pass: `/adapt`.

### B03. Tables leak horizontal overflow outside their scroll region

Locations: [Table.tsx:15](../src/components/Table/Table.tsx#L15), [TableBlock.tsx:91](../src/blocks/TableBlock.tsx#L91), and [SearchableTableBlock.tsx:298](../src/blocks/SearchableTableBlock.tsx#L298).

At 320px, bare TableBlock produced an 808px document; searchable variants produced 837px and 532px documents. Their table scrollers were correctly bounded at 288px. The absolutely positioned `sr-only` Actions heading escaped the intended containing context. Setting `position: relative` on the scroll-region wrapper **only in the diagnostic browser** reduced every document to 320px, without removing the intended table scroll area.

Impact: the whole page scrolls into blank horizontal space despite a seemingly correct responsive table. Establish a containing block for positioned descendants, keep the named keyboard-focusable scroll region, and add a regression with the full-width sample columns and row actions. A one-column table probe does not expose this defect. Suggested pass: `/adapt`.

### B04. TableBlock announces incorrect selection

Locations: [TableBlock.tsx:49](../src/blocks/TableBlock.tsx#L49) and [line 77](../src/blocks/TableBlock.tsx#L77).

Selecting one of two rows checks “Select all rows” with `indeterminate=false`. After selecting both old rows and replacing them with two new IDs, the header remains checked while both visible rows are unchecked. The code compares set size rather than membership and treats a partial selection as fully checked.

Impact: people cannot trust the selection state before a bulk action. Derive full/partial selection from current row IDs, use the Checkbox mixed-state support, and define how selection is reconciled or retained across changed data. Test filtering, deletion, row replacement, and pagination against that contract. Suggested pass: `/harden`.

### B05. Some action colours and dark examples are unreadable

Locations: [QuickSendBlock.tsx:47](../src/blocks/QuickSendBlock.tsx#L47), [RecentTransactionsBlock.tsx:51](../src/blocks/RecentTransactionsBlock.tsx#L51), [ActivityItem.tsx:113](../src/components/ActivityFeed/ActivityItem.tsx#L113), [HeaderBlock.tsx:412](../src/blocks/HeaderBlock.tsx#L412), and [LoginBlock.stories.tsx:44](../src/blocks/LoginBlock.stories.tsx#L44).

Fresh axe results measured Quick Send's small action text at **3.68:1** and notification orange text/links at **3.07:1** against white. Some notification highlighted text is authored in the fixture; the link colour is authored by ActivityItem. In global dark mode, explicit dark Header variants use a grey token whose value inverts to a light surface, producing low-contrast navigation. The work-email fixture hard-codes a pale peach background while inherited foreground tokens become light.

Impact: essential labels become difficult or impossible to read. Use semantic readable action text and paired surface/foreground roles; repair the fixture independently of the login component; test explicit themed variants inside both global modes. Keep authentic social-provider artwork distinct from themeable interface colours. Suggested pass: `/colorize`.

Visual evidence: [dark Header](block-audit-evidence-2026-09-21/blocks-header--dark-background-dark-1440.png), [work-email fixture](block-audit-evidence-2026-09-21/blocks-login--work-email-dark-390.png), and the contrast node details in the scan JSON.

### B06. Notification metadata collides at narrow widths

Location: [ActivityItem.tsx:98](../src/components/ActivityFeed/ActivityItem.tsx#L98), composed by [NotificationsBlock.tsx:83](../src/blocks/NotificationsBlock.tsx#L83).

The date and link do not wrap while time remains pinned alongside them. The fixture visibly overlaps at 390px. A bare 320px block reproduced the same collision: the link's right edge was 281.8px while time began at 236.8px. The outer `overflow-clip` hides some excess content rather than making it reflow.

Impact: labels become unreadable and linked text is obscured. Stack or wrap metadata according to available container width, retain readable timestamps, and exercise long filenames/comments as well. Suggested pass: `/adapt`.

Evidence: [phone notification preview](block-audit-evidence-2026-09-21/blocks-notifications--default-light-390.png) and `overlappingMetadata` in the bare-layout records.

## P2 — close in the foundation pass

### B07. Custom theme roles do not consistently reach block surfaces

Locations: [QuickSendBlock.tsx:57](../src/blocks/QuickSendBlock.tsx#L57), [RecentTransactionsBlock.tsx:61](../src/blocks/RecentTransactionsBlock.tsx#L61), [LoginBlock.tsx:297](../src/blocks/LoginBlock.tsx#L297), and [EmptyStateBlock.tsx:81](../src/blocks/EmptyStateBlock.tsx#L81).

Changing `--color-surface` to `#f2e9da` left Quick Send's card `rgb(255,255,255)`. These surfaces use `bg-white` plus a dark override, while Table uses the semantic surface role. Fixed radii, type sizes, and illustration palettes also need an explicit flavour/customisation boundary.

Impact: consumers cannot consistently apply a semantic theme without block-specific overrides. This is **partial themeability**, not absence of all theming: grey/primary variables, dark mode, `className`, and the illustration palette already provide useful control. Migrate intended customisation points to shared semantic roles and test scoped light/dark islands. Suggested pass: `/colorize`.

### B08. Presentation wrappers obscure the true responsive contract

Locations: [RecentTransactionsBlock.stories.tsx:16](../src/blocks/RecentTransactionsBlock.stories.tsx#L16), [LoginBlock.stories.tsx:30](../src/blocks/LoginBlock.stories.tsx#L30), and table story wrappers.

Recent Transactions' fixed 370px wrapper and Login's nested padding make examples overflow or feel cramped where the bare block fits. Centred intrinsic-width table examples add overflow on top of B03. This can mislead both consumers and future automated checks.

Impact: examples demonstrate a worse integration than the component supports. Give previews bounded, shrinkable containers, and separately retain narrow-container stress stories. Avoid “fixing” the block solely to compensate for a fixture. Suggested pass: `/adapt`.

### B09. Collection semantics and heading composition need a consistent contract

Locations: [NotificationsBlock.tsx:83](../src/blocks/NotificationsBlock.tsx#L83), [ActivityItem.tsx:59](../src/components/ActivityFeed/ActivityItem.tsx#L59), and the repeated h3/div collection structures in Quick Send and Recent Transactions.

Notifications declares `role="feed"`, but articles lack the corresponding named/positioned feed contract and focus-driven interaction model. The static list would be simpler as native list content. Other collection blocks expose buttons but no list structure. Fixed h3 headings cannot always fit a consumer's hierarchy. These are source-reviewed composition gaps; they were not reported as automated axe violations.

Impact: navigation and structural context are less useful to assistive technology and composition is brittle. Use list semantics for ordinary collections, or implement the full documented feed model where genuinely needed. Define heading-level/slot support before copying the pattern into many blocks. Suggested pass: `/harden`.

### B10. Blocks can render controls with no configured action

Locations: [LoginBlock.tsx:127](../src/blocks/LoginBlock.tsx#L127), [LoginBlock.tsx:285](../src/blocks/LoginBlock.tsx#L285), [SearchableTableBlock.tsx:205](../src/blocks/SearchableTableBlock.tsx#L205), and [TableBlock.tsx:142](../src/blocks/TableBlock.tsx#L142).

Default social-provider buttons and sign-up can render with no callback. TableBlock renders actions and pagination without requiring handlers. Searchable Table defaults to showing Filter even without an `onFilter` callback. Notification/empty-state examples also present configured labels without behavior.

Impact: a block can appear complete while its visible actions do nothing. Make availability explicit: require handlers for enabled actions, omit unavailable actions, or expose a documented disabled/read-only state. Demo-only actions should give visible local feedback rather than appear functional. Suggested pass: `/harden`.

### B11. Login's pending contract is incomplete

Locations: [LoginBlock.tsx:141](../src/blocks/LoginBlock.tsx#L141) and [line 236](../src/blocks/LoginBlock.tsx#L236).

The pending prop disables email, password, and submit, but the remember checkbox, social-provider buttons, and sign-up action remain enabled. The work-email variant accepts `onForgotPassword` but does not show recovery because the recovery action is coupled to the remember-me row.

Impact: a user can change remembered session intent or initiate another authentication route while credentials are pending, and recovery is unavailable in one variant. Define which actions remain available during authentication, guard duplicate submissions, and make recovery independent of the checkbox option. Suggested pass: `/harden`.

### B12. Copyable block documentation still describes unsupported APIs

Locations: [docs/blocks.md:86](blocks.md#L86), [docs/blocks.md:194](blocks.md#L194), and [login-block.mdx:65](../packages/docs/content/blocks/login-block.mdx#L65).

The older block guide shows `variant="signin"`, string social-provider arrays, Quick Send `onSend`, and table props that disagree with current source. The live login MDX has duplicate `socialProviders` attributes, including the incompatible string-array example. Quick Send currently selects a beneficiary; it does not submit a transfer amount.

Impact: copied examples fail or promise behavior that is not implemented. Reconcile all guides with the public contract, compile whole copyable examples, and make catalog/AI entries explicit about each block's actual task. Suggested pass: `/clarify`.

### B13. Empty-state action sizing is too rigid

Location: [EmptyStateBlock.tsx:71](../src/blocks/EmptyStateBlock.tsx#L71).

The 135px action width forces “Upload Photos” onto two lines even in the ordinary supplied fixture. Longer translated labels exacerbate the problem. No page overflow was observed in the isolated text-scaling probe, but absence of overflow does not establish good internal layout.

Impact: a prominent action looks cramped and longer labels may become hard to read. Use content-driven width with a safe maximum and intentional wrapping/minimum-height behavior. Suggested passes: `/layout`, `/polish`.

Evidence: [empty-state phone preview](block-audit-evidence-2026-09-21/blocks-emptystate--upload-photos-light-390.png).

## Preserve these strengths

- Shared components already provide native tables, column scopes, sort-state attributes, a keyboard-focusable table region, named checkboxes, and named row actions.
- Login uses real form submission, associated labels, correct autocomplete hints, a named password toggle, and an announced error slot.
- Notifications has a named section and readable “Unread” text in addition to its visual dot.
- Recent Transactions uses visible direction words and signs, rather than colour alone.
- Searchable Table's local filtering and membership-based header selection behaved correctly in the specific tested filter case. Do not carry the older report's stale filter-state finding forward as if it still reproduced. Cross-page/deleted-row selection ownership was not comprehensively verified here.
- Light/dark variable overrides, explicit light islands, and illustration palette customisation are useful existing foundations.

## Repair order and expansion gate

1. **P1 `/harden`** — fix Header mobile destinations/menu relationships and TableBlock's false selection state.
2. **P1 `/adapt`** — contain the table's positioned descendants; repair notification metadata and Header intermediate widths.
3. **P1/P2 `/colorize`** — repair contrast, paired dark surfaces, and semantic theme overrides.
4. **P2 `/harden` and `/clarify`** — complete action/pending/collection contracts and reconcile copyable examples.
5. **P2 `/polish`** — adjust empty-state action sizing, fixture spacing, and representative content.

Re-run `/audit` after the repairs. These passes can be run individually or together. The current request produced an audit and catalog plan; **no production block implementation was changed**. Runtime style changes in diagnostic probes were temporary and are not fixes in the repository.

The [expansion plan](blocks-expansion-plan.md) records the owner-confirmed 12-category allocation and proposes all 100 ideas. First repair the seven public blocks and finish Header, then expand in small batches with the same acceptance gate. Count a block once by task, irrespective of variants or modes.

## Standards and limitations

The reflow review uses the [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): ordinary content should work at 320 CSS pixels, while intrinsically two-dimensional data can use an appropriate bounded presentation. Intended inner table scrolling is not itself the defect in B03.

For targets, use [W3C Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): AA's 24px rule includes spacing and other exceptions. The scanner recorded small targets for investigation; it did not turn every control below 44px into a claimed AA violation. Larger touch areas remain a useful design goal.

The [W3C feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) describes the article semantics and assistive-technology interoperability model relevant to B09.

Automated scans do not establish full WCAG compliance. This review did not complete a screen-reader pass, all keyboard flows, every locale, all empty/error/loading states, scoped-theme switching, every custom palette, every browser engine, or production-performance profiling. The 200% probe changed root text size; it was not an operating-system text setting or full-browser zoom test. Those scenarios remain part of the proposed release gate.
