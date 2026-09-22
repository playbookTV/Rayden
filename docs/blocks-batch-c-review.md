# Batch C independent review

Review findings addressed on 22 September 2026; see [the resolution and verification record](blocks-batch-c-polish.md). The original findings below are preserved as review history.

Reviewed 22 September 2026. Scope: Application Shell, Page Header, Workspace Switcher, Command Palette, and their Application Chrome composition. Review only; implementation files were not changed.

## Verdict

These are four useful additions to Navigation & shells. The composition feels like a coherent application: restrained orange, readable typography, clear navigation groups and useful permission explanations. Conventional application structure is appropriate here. There is no obvious decorative gradient/glow/card-template excess. Repeated page and content headings, and excess mobile context, are the main visual weaknesses.

The library now has the previous 20 public blocks plus these four implemented blocks. The four are not yet exported through the public blocks entry; count them as 24 implemented, 20 publicly exposed, pending distribution work.

## Evidence and limits

- Live review of the combined application at desktop width and 390px, including light and dark examples. At 390px, both inspected examples had document width 390px; this is a spot check, not an exhaustive responsive certification.
- Filtered the workspace list, used Down/Enter to switch to Northwind, and observed both the trigger and page context update. Used command search and Down/Enter to open Profile. Checked collapsed navigation and Escape.
- Independent source review of the four components and public export barrel.
- Impeccable 3.1.0 deterministic scan returned zero findings for each of the four component files. Its clean output did not detect the behavioral concerns below. No browser detection overlay was injected.
- The batch's existing report records 62 passing stories and broader accessibility checks. Those checks were not rerun in this review. No screen-reader or cross-browser certification is claimed.
- Graph evidence: Rayden project, generation 2026-09-22T12:13:18Z; all six inspected implementation/composition/export paths reported no recorded coverage issue and matching metadata. Exact source was read for material findings.

## Priority findings

1. **P1 — Finish distribution before treating these as shipped.** `src/blocks/index.ts` omits all four components and their types. Add public exports, consumer checks, documentation and catalog entries, then refresh the package. This is an explicitly unfinished release gate, not an unexpected regression.
2. **P2 — Compact the mobile application header.** At 390px, navigation and page context occupy approximately 530–560px before workspace content begins. Actions wrap over two lines and metadata adds another large section. Keep the title and essential action visible, disclose secondary metadata/actions, and avoid repeating “Team tasks” or “Your profile” immediately inside the content. Suggested passes: `/layout`, `/distill`, `/adapt`.
3. **P2 — Keep ordinary typing separate from unmodified shortcuts.** `CommandPaletteBlock.tsx:339–345` listens globally and prevents the configured key even inside editable fields. With `{ key: "k", modifier: "none" }`, the handler will intercept typing “k”, including in its own search input. Guard editable/contenteditable targets and composition events; add a behavioral regression check. This is source-verified, not reproduced in the default story, which does not enable that configuration. Suggested pass: `/harden`.
4. **P2 — Make workspace choices reliably actionable.** `WorkspaceSwitcherBlock.tsx:53–62` permits omission of `onSelect`, while items may also omit `href`. Choosing such an item closes the popover without switching (`355–358`). Enforce the documented callback requirement in the prop contract or present these entries as unavailable. The inspected composition supplies a callback and works correctly. Suggested pass: `/harden`.
5. **P2 — Derive the demo task status from the actual tasks.** `ApplicationChromeComposition.stories.tsx:160` hard-codes “4 open”; the initial data contains three open tasks, and the sidebar/filter show three. This weakens confidence in the demo and remains stale after edits. Derive all three displays from the same task state. Suggested pass: `/clarify` plus a small interaction check.

## Heuristic assessment

Subjective design-review scores for the inspected composition and source contracts, not automated accessibility scores.

| Heuristic | Score / 4 | Evidence |
|---|---:|---|
| System status | 2 | Clear states, but inconsistent task count |
| Real-world language | 3 | Familiar workspace and task terminology |
| User control | 3 | Dismissible overlays and working keyboard paths |
| Consistency | 3 | Cohesive appearance; repeated page/content titles |
| Error prevention | 2 | Explicit permission states; actionless configuration still possible |
| Recognition | 3 | Named navigation and visible current workspace |
| Efficiency | 3 | Filtering, keyboard selection and optional shortcuts |
| Minimalist design | 3 | Restrained desktop; tall mobile header |
| Error recovery | 3 | Dedicated loading/error/empty patterns and retry hooks |
| Help and documentation | 2 | Detailed batch notes, public documentation wiring pending |
| **Total** | **27 / 40** | **Useful foundation; finish focused improvements before release** |

## Cognitive load and user perspectives

Desktop choices are reasonably grouped: workspace navigation has three options, account navigation two, and page actions three. The seven-workspace picker provides filtering and current-state marking. On the eight-item cognitive checklist, two concerns remain in the mobile composition: hierarchy and immediate task focus. This is moderate load, driven by stacked context rather than excessive task complexity.

- **Power user:** keyboard workspace selection and command navigation work. An unmodified shortcut configuration could interfere with typing.
- **Keyboard-dependent user:** focus is visible in inspected paths and disabled destinations explain why. A full assistive-technology session remains unperformed.
- **Mobile user:** navigation/search remain available, but too much scrolling precedes the main task.

The intended emotion is calm confidence. The visual system largely supports it; contradictory counts and controls that can silently do nothing undermine it. The largest opportunity is to make the composition feel as carefully edited as each individual block.

Recommended order: complete export/documentation wiring; harden the two optional configurations; correct demo state; compact mobile context; finish with `/polish`. No new design-direction decision is needed for these concrete findings.
