# Rayden UI: deeper quality audit — September 20, 2026

## Anti-pattern verdict

**Pass for the inspected visual direction.** Rayden remains restrained and suitable for broad product teams seeking a calm, approachable interface. No decorative redesign is warranted by this sample. The important problems are behavioral: some controls cannot be operated by keyboard, some documented examples cannot work as written, and theme rules remain inconsistent beyond the components fixed in the first pass.

## Executive summary

**10 findings: 7 P1 major, 3 P2 minor; no P0 or P3 findings recorded.** Prioritize keyboard operation, reliable controlled state, and truthful working examples before further visual polish.

The existing suite passed **269 tests across 42 files**, yet targeted inspection found missing interaction contracts. Five temporary diagnostic probes also passed by asserting the current defects: ignored external date-range reset, an upload example that never updates, discarded tooltip children, mouse-only table sorting, and tabs with no initial keyboard entry point. These probes establish defects; they are not passing acceptance tests for the intended behavior.

| Dimension | Score / 4 | Key finding |
|---|---:|---|
| Accessibility | 1 | Sliders and sorting lack keyboard operation; default tabs have no tab stop |
| Performance | 1 | Button-only consumer bundle retains 1,153,062 gzip bytes of JavaScript |
| Responsive design | 2 | Calendar fits the tested phone viewport; pagination and table previews escape their bounds |
| Theming | 2 | Shared tokens exist, but legacy dark overrides and literal colors conflict |
| Anti-patterns | 3 | Restrained appearance; some controls visually promise behavior they do not provide |
| **Total** | **9/20** | **Poor under this audit rubric: major functional work remains** |

Scores are provisional for this sample, not a compliance certification or a measured user-experience score. This technical rubric differs from the first review's 40-point heuristic rubric; the totals are not a before/after comparison.

## Scope and method

- Reviewed source for Slider/RangeSlider, DatePicker, Select/SelectOption, DropdownMenu, Tooltip, Table, Tabs/Tab, Input, Pagination, FileUpload/DropZone, and Checkbox/Radio/Toggle, plus relevant docs and test/build configuration.
- Exercised the local production documentation at `http://127.0.0.1:3001`: slider, date picker, select, tooltip, table, pagination, and input pages. Inspected desktop and 390 × 844 layouts, computed colors, focus, selected state, and overflow.
- Used codebase graph Verify-tier discovery and coverage checks. Checked generations advanced from `2026-09-20T12:19:07Z` to `2026-09-20T12:34:51Z`; the cited new evidence paths had no recorded coverage issue and matching metadata at their checks. Relevant component scopes had no recorded gaps. Exact source was also read; graph coverage is best effort, not proof of completeness.
- Ran the existing Storybook/Vitest suite and five temporary behavior probes using the installed Chromium headless shell. Removed the temporary test configuration and probes afterward. The final probe run passed all assertions but emitted a process-cleanup timeout warning; its exit status was zero.
- Bundled a minimal Button consumer with the installed esbuild dependency, minification and tree shaking enabled, with React and optional chart/form peers external. Compressed output with Node's gzip implementation.
- No application implementation was changed during this audit. Previous fixes remain in place. Native drag/drop filtering is source-reviewed only; attempted synthetic drag events were not reliable enough to count as browser evidence. No real files were uploaded to a service.
- This is not a full screen-reader, cross-browser, 200% text-zoom, network performance, or whole-library contrast audit. No fresh axe violation count is claimed.

## P1 findings

### 1. Sliders look interactive but cannot be adjusted by keyboard

**Category:** Accessibility. **Location:** `src/components/Slider/Slider.tsx:160` and the corresponding RangeSlider track near line 310.

The single slider exposes `role="slider"` and `tabIndex=0`, but only pointer handlers change its value. In the running basic example, pointer interaction set the value to 48; focusing it and pressing Right left it at 48. The visible `label` is a separate span, with no programmatic connection to the slider. The range control exposes only one slider and its low value; neither thumb has its own accessible control.

**Impact:** Keyboard users cannot change a value. Assistive technology cannot identify the visible label or independently operate the upper range endpoint. This affects real filtering and settings workflows, not just presentation.

**Recommendation:** Use native range inputs where practical, or implement Arrow/Home/End behavior, naming, disabled state, and two independently focusable, constrained range thumbs. Cover nonzero minima and step alignment in acceptance tests.

**Standard:** [WCAG 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html); [APG multi-thumb slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/). **Suggested command:** `/harden`.

### 2. Sortable table headers only respond to clicks

**Category:** Accessibility. **Location:** `src/components/Table/Table.tsx:68`.

`TableHead` attaches `onSort` to a `<th>` without a focusable button or keyboard handler. The diagnostic probe confirmed a tab index of -1 and no callback on Enter, while a click invoked sorting.

**Impact:** A keyboard user cannot sort a table that a pointer user can sort.

**Recommendation:** Place a real `type="button"` control inside the header, preserve `aria-sort` on the column header, and test keyboard and pointer activation together.

**Standard:** [WCAG 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). **Suggested command:** `/harden`.

### 3. Tabs with default props have no keyboard entry point

**Category:** Accessibility. **Location:** `src/components/Tabs/Tabs.tsx:50`; `src/components/Tabs/Tab.tsx:85` and corresponding pill/line branches.

The default active value is an empty string. Every inactive tab receives `tabIndex=-1`. A valid `<Tabs><Tab value="one">…</Tab><Tab value="two">…</Tab></Tabs>` therefore produces no tab stop. The diagnostic probe confirmed both tabs had -1. Arrow navigation exists, but users cannot reach it by Tab in this configuration.

**Impact:** The advertised optional selection props produce an inaccessible default. Consumers must know to supply a matching value to recover basic operation.

**Recommendation:** Make the first enabled tab the entry point when no active value is available; handle removed or newly disabled active tabs. Keep the existing directional navigation and test entry as well as movement.

**Standard:** [WCAG 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). **Suggested command:** `/harden`.

### 4. DatePicker can display a range that the parent has cleared

**Category:** Interaction correctness / Accessibility. **Location:** `src/components/DatePicker/DatePicker.tsx:447`; day buttons near line 190; month grid near line 305; `packages/docs/content/components/date-picker.mdx`.

`rangeValue` only initializes internal state. Changing the prop later does not update the displayed range. The diagnostic probe initialized September 1–3, changed the controlled value to `[null, null]`, and still found September 1 announced as the selected range start.

The calendar also lacks the documented arrow navigation: Right left focus on September 1, and the basic month contained 30 separate day tab stops. Rows contain buttons directly rather than gridcells. The basic single-date demo supplies neither state nor an onChange callback, so clicking a day does not produce a selected state. Its month/year header is a button with a chevron but no action.

**Impact:** External form resets can disagree with what users see. Keyboard browsing is laborious, and the demo does not accurately show selection behavior. The stale controlled value is the primary P1 defect; missing arrow navigation alone does not prove keyboard inoperability, because individual day buttons remain reachable.

**Recommendation:** Establish explicit controlled/uncontrolled behavior, derive controlled range display from the prop, add roving day focus and valid grid structure, and wire live examples to state. Implement or remove the inert month/year affordance.

**Suggested command:** `/harden`, then `/clarify` for the documentation.

### 5. Tooltip documentation describes a different component

**Category:** Documentation correctness / Accessibility. **Location:** `src/components/Tooltip/Tooltip.tsx:26` and `:110`; `packages/docs/content/components/tooltip.mdx:20`.

The guide demonstrates child triggers, `placement`, `delay`, controlled `open`, and React-node content. The implementation renders an always-visible panel, takes `position` and string content, and replaces the passed children with its own panel. The live Basic example shows the tooltip but no “Hover me” button; the diagnostic probe confirmed the trigger is absent.

The panel can contain action buttons while carrying `role="tooltip"`, which is not the appropriate interaction model for a focusable popover.

**Impact:** Copying the documented pattern removes the intended trigger and does not provide hover/focus behavior. Teams cannot trust the examples or accessible semantics.

**Recommendation:** Decide the public contract: implement a trigger-based tooltip with an accessible description relationship, or document/rename the existing visual panel as a popover and give it appropriate interaction behavior. Compile and exercise the actual examples.

**Standard guidance:** [APG tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/). **Suggested command:** `/shape`, then `/harden` and `/clarify`.

### 6. Upload examples do not update, and rejection feedback is missing

**Category:** Error recovery / Documentation correctness. **Location:** `src/components/FileUpload/FileUpload.tsx:90`; `src/components/FileUpload/FileUploadDropZone.tsx:87`; `packages/docs/components/demos.tsx:182`; `packages/docs/content/components/file-upload.mdx:84`.

The live demos pass `files` and `onFilesChange`, but omit `onUpload`. The root component destructures `onFilesChange` without invoking it; selection only calls `onUpload`. The diagnostic probe matching the demo selected a test file, received no file-list callback, and rendered no file name.

The guide's progress/error examples omit required controlled-list props and describe an array upload callback, while the actual callback receives one File. Its `progress`, `uploading`, and string-error callback contract do not match the implemented API. Oversize files are silently skipped; excess files are silently sliced off. Source inspection shows `accept` is passed to the native chooser but is not validated along the drop-handler path.

**Impact:** Users select a file and see nothing happen; developers cannot implement the documented progress/error flow as written. Rejected files give users no useful recovery instruction.

**Recommendation:** Unify selection and rejection handling, define which callback owns list updates, provide per-file rejection reasons, and use the same validation for chooser and drop inputs. Implement functioning local demo state/progress and generate examples against the actual types. File-type filtering in the UI should not be treated as server-side validation.

**Suggested command:** `/harden`, then `/clarify`.

### 7. Remaining theme and feedback colors fail outside Button

**Category:** Theming / Accessibility. **Location:** `src/components/Pagination/Pagination.tsx:97`; `src/components/Input/Input.tsx:240`; `src/components/Table/Table.tsx:47` and `:78`.

Two measured text pairs fail the normal-text contrast threshold:

| Element | Foreground | Effective background | Contrast |
|---|---|---|---:|
| Current page number in dark pagination | `#000000` | `#101928` | **1.19:1** |
| “Email is available” success message, 14px | `#0f973d` | `#f9fafb` | **3.64:1** |

The repaired preview canvas is correctly dark, but Table's legacy `dark:bg-grey-900` resolves to an almost-white row under the inverted token palette. Its dark row background measured `#f9fafb`, with headers `#f7f9fc`. The mismatch comes from component styling, not the theme selector. It can also put documentation link colors intended for a dark surface onto a light table.

**Impact:** Users lose the current-page cue and struggle to read feedback; the same theme produces contradictory surfaces across components.

**Recommendation:** Extend semantic surface, foreground, and feedback tokens beyond Button. Remove double inversion in legacy component rules and replace literal black for semantic text. Test component state × theme combinations, including selected, success, hover, and focus.

**Standard:** Normal-size text generally requires at least 4.5:1 under [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). **Suggested command:** `/colorize`, followed by `/audit`.

## P2 findings

### 8. Pagination and tables escape their mobile preview bounds

**Category:** Responsive design. **Location:** `src/components/Pagination/Pagination.tsx:66`; `src/components/Table/Table.tsx:13`; `packages/docs/components/Preview.tsx`.

At 390px, the basic pagination measured approximately 398px wide, beginning at x=-4. A larger sibling example measured 454px, beginning at x=-32; the page's scroll width grew to 422px. Previous/Next controls visibly extended outside the canvas. The basic table measured 375px within a narrower padded preview, extending outside the panel and squeezing names onto multiple lines.

**Impact:** Phone users encounter clipped edges and horizontal page movement while comparing controls. The earlier removal of preview clipping exposed these components' intrinsic widths; restoring blanket clipping would hide the symptom rather than preserve access.

**Recommendation:** Give pagination a compact mode based on available width, preserve previous/next actions, and reduce visible page numbers. Put wide tables in an explicitly scrollable region within their own preview. Test 320px, 390px, narrow desktop containers, and enlarged text. Treat 44px touch targets as a usability goal, not an automatic claim that every smaller control violates WCAG AA.

**Suggested command:** `/adapt`.

### 9. Select remains open after keyboard focus leaves it

**Category:** Keyboard usability. **Location:** `src/components/Select/Select.tsx:165` and `:286`.

Arrow selection and Enter worked: Country changed from United States to United Kingdom and returned focus to the trigger. Reopening and pressing Tab moved focus into the following code example, while the listbox remained visible and `aria-expanded` stayed true. Escape closed it.

**Impact:** Users leave behind an open popup whose focus has moved elsewhere, weakening orientation and making subsequent navigation unpredictable. A workaround exists via Escape.

**Recommendation:** Close when focus leaves the composite control, preserve normal Tab movement, and define the same policy for menus. DropdownMenu has similar source structure but its runtime behavior was not independently reproduced in this pass.

**Suggested command:** `/harden`.

### 10. A Button import retains an unexpectedly large payload

**Category:** Performance. **Location:** `tsup.config.ts`; `src/utils/resolveIcon.tsx:1`; `src/components/Icon/Icon.tsx:3`; `src/components/Icon/icons.ts:6043`; package root exports.

Measured with a minimal consumer exporting only Button:

| Build | Minified JavaScript | Gzip bytes |
|---|---:|---:|
| From built `dist/index.js` | 3,486,100 bytes | **1,153,062** |
| Directly from Button source | 953,687 bytes | **262,182** |

The direct-source bundle's largest contributor was the icon registry. Button imports the icon resolver, which imports the entire dynamic name registry. The much larger public-entry result also demonstrates retention beyond the direct Button dependency path; attributing every retained byte requires a further packaging analysis.

**Impact:** A consuming app may pay a substantial download and parse cost for a simple control, undermining the promise of importing only what is needed. This is a controlled bundle experiment, not a measurement of a deployed app's network transfer or interaction latency.

**Recommendation:** Separate optional name-based icon lookup from basic components, support static icon data without retaining the registry, investigate public-entry tree shaking and initialization side effects, and establish a small-consumer bundle budget in CI. Verify results with both a minimal consumer and an actual starter app.

**Suggested command:** `/optimize`.

## Systemic gaps

1. **Documentation is not exercised as a product.** Tooltip, upload, and basic calendar examples demonstrate contracts or interaction states the implementation does not supply. Use one executable example source for both rendered previews and snippets.
2. **Passing tests do not yet establish interaction coverage.** The inspected Slider, DatePicker, Table, Tooltip, and FileUpload story files have no `play` functions. The global configuration includes the accessibility addon but does not explicitly set a failing accessibility-test policy. Add behavior assertions and verify that a known accessibility failure makes CI fail; do not infer that from the addon being installed.
3. **Two theme strategies coexist.** Some components rely on inverted palette tokens; others invert again using dark utility classes. Address the shared convention rather than patching each screenshot separately.
4. **Default props need their own acceptance tests.** Test omitted values, external resets, disabled active items, rejection paths, and narrow containers, not only curated examples with ideal props.

## Positive findings to preserve

- The prior Button/Modal/Preview improvements remain intact, and the complete existing suite passes.
- Select's arrow navigation, Enter selection, and focus return worked in the running UI.
- Input uses actual labels, native required/disabled behavior, `aria-invalid`, and associated helper/error descriptions.
- Checkbox, Radio, and Toggle build on native inputs and wrap labeled variants in a clickable label.
- The calendar provides full date names and disabled day states; its single-month layout fit the tested 390px viewport.
- The build provides ESM exports, type declarations, and an explicit CSS side-effect declaration. These are useful foundations for fixing bundle retention.

## Recommended sequence

1. **P1 `/harden`** — Restore keyboard operation and robust state ownership in sliders, sorting, tabs, calendar, and upload handling; add acceptance tests for each failure.
2. **P1 `/shape` + `/clarify`** — Resolve Tooltip's actual contract and align tooltip/upload/calendar examples with working behavior.
3. **P1 `/colorize` + `/audit`** — Standardize semantic colors and verify feedback/selection contrast across themes.
4. **P2 `/adapt`** — Fix pagination and table containment at narrow widths.
5. **P2 `/optimize`** — Reduce the minimal consumer payload and add a bundle budget.
6. **`/polish`** — Finish spacing, focus treatments, and visual consistency after behavior is reliable.

These can be handled one at a time, together, or in a different order. Re-run `/audit` after fixes using the same scenarios; compare individual results rather than treating the current provisional score as a certification.

## Implementation follow-up — September 20, 2026

All ten findings above have been addressed in the working tree. The original observations and scores are retained as the before-state, not a description of the updated components.

| Finding | Implemented correction | Acceptance evidence |
|---|---|---|
| 1. Slider keyboard support | Arrow, Home/End, Page Up/Down; programmatic names; separately focusable bounded range handles; stepped initial range values | Browser stories cover single/range keys, nonzero minima, steps, and endpoint bounds; 320px docs fit |
| 2. Table sorting | Real buttons inside sortable headers; sorting state remains on the column header | Enter invokes the sort callback |
| 3. Default tabs | First enabled tab is the default keyboard entry; disabled selections fall back to an enabled tab | Default and dynamically disabled states tested |
| 4. DatePicker state and keyboard | Controlled range derives from props; explicit uncontrolled defaults; roving day focus, gridcells, arrow/month/year movement; inert header affordance removed | External reset and cross-month keyboard selection pass; selection also verified in the live 320px docs |
| 5. Tooltip contract | Child triggers, hover delay, immediate focus, controlled state, Escape, accessible descriptions; action panels use dialog semantics and restore focus | Trigger and action-panel stories pass; live preview displays the previously missing trigger |
| 6. File upload | Selection updates the controlled list before upload callbacks; shared chooser/drop validation; visible rejection messages; working removal; corrected docs and demos | Selection, removal, synthetic drop-type rejection, and size rejection tested; no remote upload performed |
| 7. Themes and feedback | Semantic surface and feedback colors; selected pagination text; removed duplicate dark inversion from Table/Tabs; readable Select placeholder | Automated contrast checks pass for the new light/dark fixtures, including input success and pagination |
| 8. Narrow layouts | Container-responsive pagination with retained previous/next actions; keyboard-scrollable table region; full-width preview/demo containers | 280px fixtures pass; 390px live tables scroll internally with page width remaining 390px; stacked pagination demo repaired |
| 9. Popup dismissal | Select and DropdownMenu close when focus exits the composite control | Select Tab test confirms dismissal and normal focus movement |
| 10. Payload | Preserved component module boundaries; optional named-icon catalog loaded separately; static icon entry isolated from that catalog | Button 9,542 initial gzip bytes; static Icon + homeIcon 9,897 bytes; both have 15,000-byte CI budgets |

### Verification

- Full browser suite: **279 tests across 43 files passed** after the primary fixes. Two additional regression stories were then added for stepped ranges and action-popover focus return; the final focused run passed **20 tests across two files**, including all **12** interaction-contract stories.
- The new interaction stories enforce failing accessibility checks. The missing accessibility test annotations were restored; an intentionally unnamed button failed as expected before that temporary test was removed. This verifies that the gate is active, rather than merely installed.
- Type checking, targeted component lint, package build, bundle budgets, ESM server rendering, CommonJS import, and whitespace checks passed.
- Documentation production build generated **52 pages**. A local Vite blank starter, supplied with Button and a static icon and linked to the built package, compiled successfully: approximately **71.53 KB gzip** for initial application JavaScript including React, plus a separate optional catalog chunk.
- Development mode was started and observed rebuilding after a source-file touch, then stopped. Runtime modules, declarations, and styles remain available in watch mode.
- Production documentation was checked at desktop, 390px and 320px widths. Calendar keyboard selection, tooltip visibility/dismissal, pagination movement, upload containment, and table containment were inspected. Automated fixtures also cover both light and dark themes.
- No publication, deployment, or real file upload was performed.

### Compatibility and remaining scope

- `Icon name="…"` reserves its dimensions immediately, then loads its SVG content after mounting. The shared named catalog remains approximately **255 KB gzip** when requested. Use `Icon icon={homeIcon}` with `@raydenui/ui/icons` for immediate rendering, including server output. Bundle figures are controlled experiments with React and optional peers external, not claims about total site transfer. The docs showcase many components and still have a much larger initial bundle than a small consumer.
- FileUpload calls `onFilesChange` with pending items before calling `onUpload(file, item)`. Upload handlers should update the supplied item's ID rather than append a duplicate. The revised guide and stories demonstrate this contract.
- Table now includes a containing scroll region while its ref still targets the table. Layout selectors that relied on the table being a direct child should target the new wrapper appropriately.
- These checks address the ten audited findings; they do not establish whole-library accessibility compliance, screen-reader certification, or cross-browser coverage. The failing accessibility policy is applied to the new regression fixtures. Existing visual stories are not claimed to be exhaustive accessibility tests.
