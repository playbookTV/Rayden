# Rayden UI: additional component audit — September 20, 2026

## Anti-pattern verdict

**Pass for the overall direction, with interaction and theme problems.** The restrained appearance still fits broad product teams seeking a calm, approachable product. The highest-impact problems are hidden focus, missing navigation, unreliable examples, and unreadable notifications. A decorative redesign would not address them. The sampled source includes a literal focus background in Chip and a selected side stripe in SidebarMenu; these are secondary to the verified behavioral findings below and are not counted as additional issues.

## Executive summary

**Eight additional findings: five P1 major, three P2 minor; no P0 or P3 findings recorded.** These concern components and compositions outside the ten findings repaired in the previous pass. No application implementation was changed during this audit.

| Dimension | Score / 4 | Evidence and limits |
|---|---:|---|
| Accessibility | 1 | Focus enters collapsed content; collapsed rich sidebar labels can be unnamed; several banner colors fail contrast |
| Performance | 3 | Existing small-consumer budgets still pass; no fresh loading-time or rendering-performance measurement |
| Responsive design | 2 | Notification content extends beyond clipped phone containers; collapsed navigation removes access to children |
| Theming | 2 | Shared tokens work in many controls, but literal banner surfaces conflict with adaptive foregrounds |
| Anti-patterns | 3 | Calm visual direction; some visible controls promise unavailable behavior |
| **Total** | **11/20** | **Acceptable under the audit rubric; significant work remains in this sample** |

This score is a heuristic for the inspected sample, not a whole-library compliance score or a before/after comparison with the previous audit. Different components and states were tested.

## Scope and verification

- Read Accordion, Counter/NumberCounter, Banner, Chip, SidebarMenu/SubItem, Stepper, and Checkbox/Radio/Toggle implementations and relevant documentation. Material findings below are backed by exact source and targeted behavior checks.
- Used graph discovery and coverage checks. Relevant component paths had no recorded gaps and matching metadata; coverage generations observed were `2026-09-20T18:52:31Z` and `2026-09-20T19:22:24Z`. Graph file-pattern searches returned insufficient results for several compound components, so exact source reads and bounded file listing supplied the missing evidence. Coverage is best effort, not proof of completeness.
- Exercised production Banner documentation at desktop and 390 × 844. Measured computed foreground/background colors and container overflow. Changed one preview from dark to light to verify the theme dependency.
- Six temporary browser stories reproduced: focus inside a closed accordion, overwritten accordion click behavior, Counter's out-of-range default, inaccessible collapsed submenu, an unnamed collapsed rich-label item, and native form change-event payloads. All six diagnostic assertions passed **because they asserted the defects**, not because the desired behavior was correct. These probes were removed afterward.
- A temporary TypeScript fixture copied the documented Checkbox and Toggle callback pattern. Both produced TS2322 because a boolean state setter is incompatible with the actual input change-event callback. The fixture was removed afterward.
- Re-ran bundle budgets: Button **9,542 initial gzip bytes**, static Icon + homeIcon **9,897**, both below their 15,000-byte budgets. The previously measured optional named-icon catalog remains a separate cost; no fresh network-timing claim is made.
- No fresh whole-library axe count, screen-reader evaluation, cross-browser run, or full regression-suite run is claimed. The previous full suite and targeted repair checks are recorded in the earlier audit follow-up.

## P1 major findings

### 1. Closed accordion content remains in the keyboard sequence

**Category:** Accessibility. **Location:** [Accordion.tsx:254](/Users/leslieisah/app-dev/Rayden/src/components/Accordion/Accordion.tsx:254).

AccordionContent collapses its grid row to zero height and clips overflow, but its descendants remain mounted and focusable. In the probe, the trigger reported `aria-expanded="false"`; pressing Tab from it focused a button inside the collapsed panel instead of the visible button after the accordion.

**Impact:** Keyboard users can lose visible focus and activate hidden actions. Visual collapse does not establish an accessible hidden state.

**Recommendation:** Remove collapsed descendants from focus and the accessibility tree using an appropriate hidden/inert lifecycle. If preserving the closing animation, coordinate the semantic state with the transition. Test panels containing links, buttons, and inputs, including closing while focus is inside. **Suggested command:** `/harden`.

The [W3C accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) provides the disclosure and keyboard model; this finding is grounded in the reproduced invisible-focus behavior, not a claim that optional arrow-key navigation is mandatory.

### 2. Collapsed sidebars remove access to nested destinations

**Category:** Accessibility / Responsive behavior. **Location:** [SidebarMenuItem.tsx:124](/Users/leslieisah/app-dev/Rayden/src/components/SidebarMenu/SidebarMenuItem.tsx:124).

The collapsed branch renders only the icon button. For an expandable item, its click handler explicitly does nothing, and it never renders the submenu. Clicking Team in a collapsed sidebar neither selected a value nor exposed its Members destination. A separate probe using `<span>Home</span>` as the label produced a menuitem without an accessible name: automatic naming only handles plain strings, even though children accept React nodes.

**Impact:** Teams lose navigation functionality when using the compact layout, and common label composition can leave icon controls unnamed.

**Recommendation:** Provide an accessible flyout or expand the sidebar when activating a parent; preserve all child destinations. Require or derive a reliable accessible label for icon-only items. For ordinary site navigation, use links and disclosure buttons; only use menu roles with their corresponding interaction model. The [W3C disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) explains this distinction. **Suggested commands:** `/shape`, `/harden`, `/adapt`.

### 3. Checkbox and Toggle controlled examples do not match their API

**Category:** Documentation correctness / Form reliability. **Locations:** [form-control.mdx:49](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/form-control.mdx:49), [form-control.mdx:170](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/form-control.mdx:170), [Checkbox.tsx:5](/Users/leslieisah/app-dev/Rayden/src/components/FormControl/Checkbox.tsx:5), [Toggle.tsx:5](/Users/leslieisah/app-dev/Rayden/src/components/FormControl/Toggle.tsx:5).

The guide passes `onChange={setChecked}` and `onChange={setEnabled}`, and describes `(checked: boolean) => void`. Both components inherit the native input `onChange` contract and spread it directly onto the input. The browser probe received event objects; the copied examples failed TypeScript with TS2322.

**Impact:** Developers cannot copy the documented controlled examples into a typed project. In unchecked JavaScript, the state setter receives an event object rather than the expected boolean.

**Recommendation:** Preserve the existing native API and demonstrate `onChange={(event) => setChecked(event.target.checked)}`, or introduce an explicitly named boolean callback with a documented compatibility policy. Correct the prop tables and compile the actual snippets. Also make the live controlled-state previews interactive instead of supplying `checked` without a change handler. **Suggested command:** `/clarify`.

### 4. Banner colors become unreadable in dark mode

**Category:** Theming / Accessibility. **Location:** [Banner.tsx:47](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:47).

Some variants combine immutable pale backgrounds with foreground tokens that turn pale in dark mode; the feature variant combines literal black with a dark adaptive surface.

| Live banner title | Foreground | Background | Contrast |
|---|---|---|---:|
| New feature available / Information | `#f9fafb` | `#f0f7ff` | **1.03:1** |
| New Feature | `#000000` | `#101928` | **1.19:1** |
| Opportunity | `#f9fafb` | `#f7f8fd` | **1.01:1** |
| Payment successful, bold | `#ffffff` | `#0f973d` | **3.81:1** |

These titles use normal-sized text. The [WCAG minimum contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) specifies 4.5:1 for normal text. The information title became dark and readable when its preview was explicitly switched to light, confirming the theme interaction.

**Impact:** Users can miss notifications, including success and opportunity messages, even though the component is visibly present.

**Recommendation:** Define paired semantic foreground/surface tokens for each emphasis and status. Test all six statuses in both themes, including descriptions and action text. **Suggested commands:** `/colorize`, `/audit`.

### 5. Banner content is clipped on narrow layouts

**Category:** Responsive design. **Location:** [Banner.tsx:175](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:175).

At a 390px viewport, the “Update available” preview had a 308px-wide banner with **538px of content width**, inside a fixed 48px height with `overflow-hidden`. The informational and success variants similarly measured 442px and 409px of content width. The page itself stayed 390px wide, so page-overflow checks alone would miss the loss inside the component.

**Impact:** Notification details and potentially trailing controls extend beyond the visible banner. Users cannot scroll the clipped notification to recover that content.

**Recommendation:** Use content-driven height, a shrinkable text group, wrapping copy, and a stable action/dismiss area. Test long titles and descriptions, localized strings, and enlarged text. Preserve important descriptions on mobile rather than treating concealment as adaptation. **Suggested command:** `/adapt`.

## P2 minor findings

### 6. Adding an accordion click callback silently disables expansion

**Category:** Interaction reliability. **Location:** [Accordion.tsx:209](/Users/leslieisah/app-dev/Rayden/src/components/Accordion/Accordion.tsx:209).

AccordionTrigger installs its internal toggle handler, then spreads `rest` afterward. A supplied `onClick`, such as an analytics callback, replaces that handler. The probe confirmed the callback ran while `aria-expanded` remained false.

**Impact:** A routine integration can break an otherwise working control with no type error or warning.

**Recommendation:** Compose consumer and internal handlers, and define whether `event.preventDefault()` cancels the built-in action. Apply the same review to other compound controls that spread handlers after internal behavior. Only the accordion replacement was behavior-tested here. **Suggested command:** `/harden`.

### 7. Counter ignores its minimum until the first interaction

**Category:** State reliability. **Location:** [Counter.tsx:119](/Users/leslieisah/app-dev/Rayden/src/components/Counter/Counter.tsx:119).

`<Counter min={5} max={10} />` displays **0** because the uncontrolled default is not bounded. Pressing Increase jumps directly to **5**; clamping only occurs during updates.

**Impact:** The initial quantity violates the configured range and the first interaction is surprising. Consumers relying on the displayed value can disagree with the component's constraints.

**Recommendation:** Derive the default from the minimum and normalize uncontrolled initialization and changed bounds. Explicitly document how invalid controlled values are handled. Test nonzero minima, out-of-range defaults, and changing limits. **Suggested command:** `/harden`.

### 8. Banner's default dismiss control does nothing in the docs

**Category:** Documentation correctness / Interaction. **Locations:** [Banner.tsx:153](/Users/leslieisah/app-dev/Rayden/src/components/Banner/Banner.tsx:153), [banner.mdx:20](/Users/leslieisah/app-dev/Rayden/packages/docs/content/components/banner.mdx:20).

Banner defaults to `dismissible=true` but has no internal dismissal state; it only calls optional `onDismiss`. The basic example supplies neither state nor callback. Clicking Dismiss banner left “New feature available” visible in the production documentation.

**Impact:** The preview teaches a non-working interaction and gives users an apparently actionable close control.

**Recommendation:** Wire the demo to visibility state. For the component default, either provide uncontrolled dismissal or only expose the action when it has a handler; document whichever ownership model is chosen. **Suggested commands:** `/harden`, `/clarify`.

## Systemic findings and positives

The main gap is **composition coverage**: a component can pass a basic visual story and fail when placed in a closed container, given a richer label, or supplied an ordinary callback. Add those combinations to acceptance tests. Documentation snippets need compilation independently of the MDX page build, because fenced snippets are displayed rather than type-checked as working components.

The previous semantic-color and bundle fixes provide useful foundations. The Button and static-icon budgets still pass. Native Checkbox, Radio, and Toggle inputs already provide browser interaction and input semantics; their event API can be documented accurately without replacing that foundation. Accordion already generates linked trigger/content IDs and exposes expanded state. Preserve those strengths while fixing the missing state transitions.

## Recommended actions

1. **P1 `/harden`** — Remove hidden accordion focus and restore access to collapsed sidebar destinations.
2. **P1 `/clarify`** — Correct and compile the Checkbox/Toggle examples; wire the dismissal demo.
3. **P1 `/colorize`** — Repair Banner's status × emphasis × theme color pairs.
4. **P1 `/adapt`** — Reflow notification content and retain compact navigation functionality.
5. **P2 `/harden`** — Compose event handlers and normalize Counter initialization.
6. **`/audit`** — Repeat the same verified scenarios after the fixes.
7. **`/polish`** — Finish focus styling, spacing, and remaining minor details once behavior is correct.

These can be addressed one at a time, all at once, or in another order. Re-run `/audit` after fixes to evaluate the same sample again; do not treat a higher heuristic score as accessibility certification.
