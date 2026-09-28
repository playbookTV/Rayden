# Finance block review — 24 September 2026

Reviewed AccountBalanceBlock, TransferReviewBlock, InvoiceDetailBlock, SubscriptionBillingBlock, their shared finance helpers, and their Storybook examples against Rayden's documented calm, approachable design direction. The existing visual direction is appropriate: restrained orange accents, clear typography, meaningful status colors, and predictable grouping. No visual redesign was needed.

## Outcome

Eight issues were corrected: five P1 issues affecting feedback, review integrity or accessibility, and three P2 issues affecting edge cases and touch usability. No P0 issues were found. The scores below are review judgments within the tested scope, not certification.

| Technical dimension | Score / 4 | Assessment after fixes |
| --- | --- | --- |
| Accessibility | 3 | Automated scans and interaction regressions pass; assistive-technology validation remains. |
| Performance | 3 | No new dependencies or expensive animation/layout loops; runtime performance was not profiled. |
| Responsive design | 4 | Tested widths, enlarged text, and long labels stay within the page. |
| Theming | 4 | Light, dark, explicit theme islands and existing custom-surface fixtures pass measured checks. |
| Visual anti-patterns | 4 | Intentional financial hierarchy; no decorative gradients, glows, or arbitrary palette changes. |
| **Total** | **18/20** | **Excellent within the measured scope.** |

The independent design assessment started at 29/40. After the verified interaction fixes, the review assessment is 35/40: status visibility 4, real-world language 4, user control 3, consistency 4, error prevention 4, recognition 4, efficiency 3, minimalist presentation 3, error recovery 3, documentation 3. Cognitive load remains low: cancellation uses progressive disclosure and primary decisions stay small.

## Findings and fixes

| Severity | Finding and user impact | Resolution |
| --- | --- | --- |
| P1 | Subscription cancellation could be pending while its only progress message was hidden in a closed panel. The toggle could hide it again. | Pending keeps the panel open and prevents dismissal. Provider errors open recovery feedback. Added visible-progress and dismissal assertions. |
| P1 | Transfer recipient and amount controls remained active after submission, during processing, and after a result. | Editing and acknowledgement are disabled while latched, pending, or displaying a result; provider errors allow editing again. Tested each transition. |
| P1 | A checked acknowledgement remained valid after the recipient, amount, or provider fee changed. | Acknowledgement is tied to the reviewed fields and cleared on editing or changed details. Unchanged scalar details survive parent renders. Custom React-node details should keep stable references when unchanged. |
| P1 | Four dark-mode stories rendered surrounding helper text against a white background at approximately 1.12:1 contrast. | All four block story decorators now pair semantic foreground and background tokens. The failures were in the preview harness, not the block surfaces. |
| P1 | Invoice tables widened the page from 320px to 408px at 200% root text size. | Table overflow stays inside a named, keyboard-focusable group. Long invoices retain their bounded region. Totals remain outside the table. A regression verifies containment, focus, and reaching the right edge. |
| P2 | Long untranslated compound labels widened account, transfer, and subscription examples. | Constrained controls and badges to available width and allowed their text children to shrink and wrap. |
| P2 | A real zero usage allowance was described as missing data. | Zero allowances retain their numerical values and get an accurate explanation without a fabricated proportion. |
| P2 | Most finance action targets were only 40px high. | Finance action controls now have a 44px minimum; transfer decision controls retain their larger size. The acknowledgement label provides a 44px clickable row. This was a touch usability improvement, not a claim that every 40px button violated WCAG AA. |

Relevant implementation: [shared finance helpers](../src/blocks/finance.tsx), [account balance](../src/blocks/AccountBalanceBlock.tsx), [transfer review](../src/blocks/TransferReviewBlock.tsx), [invoice detail](../src/blocks/InvoiceDetailBlock.tsx), [subscription billing](../src/blocks/SubscriptionBillingBlock.tsx).

## Verification

- **69 Storybook tests across five files passed**, including the finance composition and five new regression stories. The original 64 passed before the audit, demonstrating why rendered and state-transition checks were also needed.
- **512 viewport checks:** 64 individual-block stories × four widths (320, 390, 768, 1440px) × light/dark. No document overflow.
- **128 independent axe scans:** the same 64 stories at 390px in both global themes, including existing explicit dark-island/custom-surface fixtures. No reported violations in the selected WCAG rule tags. The Storybook suite also ran its configured accessibility checks.
- **48 stress checks:** four defaults × three widths (320, 768, 1440px) × two themes × 200% root text or long labels. No document overflow after fixes. Invoice content can scroll within its table at enlarged text sizes.
- Default action targets measured at 390px in both themes: none below 44px after the change.
- TypeScript, targeted ESLint, and formatting checks passed.
- Independent Impeccable 3.1.0 source detector returned no findings for the four blocks and shared helper. This is a regex-based source check; it cannot replace browser measurements. Its installed CLI did not support the skill's browser-overlay command, so no overlay was created.

[Machine-readable verification summary](finance-block-review-evidence-2026-09-24/verification-summary.json).

## Visual evidence

- [Account balance, light, 390px](finance-block-review-evidence-2026-09-24/account-balance-light-390.png)
- [Transfer review, dark, 390px](finance-block-review-evidence-2026-09-24/transfer-review-dark-390.png)
- [Invoice detail, dark, 390px](finance-block-review-evidence-2026-09-24/invoice-detail-dark-390.png)
- [Subscription billing, dark, 1440px](finance-block-review-evidence-2026-09-24/subscription-billing-dark-1440.png)

## Remaining verification limits

Browser work used installed Chrome on macOS. Safari, Firefox, real touch devices, screen readers, operating-system text sizing, and full browser zoom were not tested. The 200% check enlarged the root font. No bundle or performance benchmark was run. Existing QuickSend and RecentTransactions blocks were outside the implementation scope, although their composition tests passed. Arbitrary consumer palettes and custom React content still need application-specific validation.

Preserve the shared shell, token roles, heading scale, real financial values, and explicit provider outcomes. Future work should prioritize cross-browser and assistive-technology checks, followed by polish only where those checks reveal concrete issues.
