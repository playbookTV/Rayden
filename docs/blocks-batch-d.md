# Blocks Batch D — finance and billing

Status: implemented, exported from `src/blocks/index.ts`, and included in the AI manifest and public documentation. The original implementation evidence below is dated 23 September. The [24 September review](finance-block-review-2026-09-24.md) records subsequent interaction, theming, target-size, and text-enlargement fixes and supersedes the corresponding claims and limitations below.

Date: 23 September 2026.

Batch D delivers the four Finance & billing blocks that complete that category's core set of six: plan ideas 81 (Account Balance), 82 (Transfer Review), 83 (Invoice Detail), and 84 (Subscription Billing). With the two existing public blocks — Quick Send (79) and Recent Transactions (80) — the category reaches **6/6 core**.

| Block | File | Stories |
|---|---|---|
| Account Balance | `src/blocks/AccountBalanceBlock.tsx` | `src/blocks/AccountBalanceBlock.stories.tsx` |
| Transfer Review | `src/blocks/TransferReviewBlock.tsx` | `src/blocks/TransferReviewBlock.stories.tsx` |
| Invoice Detail | `src/blocks/InvoiceDetailBlock.tsx` | `src/blocks/InvoiceDetailBlock.stories.tsx` |
| Subscription Billing | `src/blocks/SubscriptionBillingBlock.tsx` | `src/blocks/SubscriptionBillingBlock.stories.tsx` |
| Shared module | `src/blocks/finance.tsx` | — |
| Composition | — | `src/blocks/FinanceOverviewComposition.stories.tsx` |

## The rule this category exists under

The plan states that finance blocks integrate provider callbacks and **must not pretend to perform a payment, authenticate a user, or provision an account**. The audit's note that QuickSendBlock "does not itself collect or send money" is the standard. Four consequences run through every block here.

1. **No invented success.** Transfer Review and Subscription Billing render an outcome only from a `result` / `cancellationResult` prop the consumer supplies. Neither derives one from a click. `state="pending"` is in-flight, not done, and says so.
2. **No invented figures.** Money and dates carry a three-way value. `number` is a real amount, and `0` is a real amount. `null` means genuinely unknown and renders as words. `undefined` omits the row. A missing fee, rate, balance or arrival estimate is therefore never a zero, and Transfer Review adds an explicit note when any figure is unknown so the distinction is stated, not merely implied.
3. **One activation per signal.** Transfer Review's confirm and Subscription Billing's cancel confirm latch on first press and release only when `state` / `cancellationState` / the result prop changes — i.e. when the consumer reports what actually happened. A confirm control that stays live after the first press is a defect in a payment flow.
4. **Cancellation is two steps and changes nothing.** Opening the panel calls `onCancelRequest`; confirming calls `onCancelConfirm(reason?)`. The plan name and the status badge change only when the consumer changes them.

## Shared conventions

These continue [Batch A](blocks-batch-a.md), [Batch B](blocks-batch-b.md) and [Batch C](blocks-batch-c.md) rather than re-deciding them. New in this batch are the last three rows.

| Convention | Reason |
|---|---|
| `headingLevel` typed `"h1"`–`"h6"`, default `"h2"` | Batch B and C's form. Sub-headings derive with `nextFinanceHeadingLevel`. |
| Destinations render `<a href>`, actions render `<button>` | Audit B01 and B10. |
| Every action is a union of `{ href }`, `{ onClick }`, or `{ unavailableReason }` | A control with nothing to do cannot be configured; a permission block is an explicit third state. |
| `bg-surface`, `bg-surface-muted`, `border-surface-border`, `border-surface-border-strong` | Audit B07. |
| `text-on-surface` / `-body` / `-secondary` / `-muted` | The foreground family that lands with `--color-surface`. **Batch D is the first batch to use it throughout**; Batch C deferred it because `globals.css` was being edited at the time. |
| `border-control-border` on control boundaries | WCAG 1.4.11; `--color-surface-border-strong` is a card edge, not a control edge. |
| `text-action-primary-text` for readable orange | Audit B05. |
| `@container` on the block root, `@min-[…]` inside; `className` lands on the container root | A block sits in a container the consumer chooses. |
| Minimum heights on controls, never fixed widths | Finance actions are now at least 44px; the transfer decision buttons remain 48px. |
| `min-w-0` and `break-words` on every flex and grid child | Long compound words wrap rather than widening the document. |
| Destinations styled as buttons use **`Button as="a"`** | The prop now exists. The local CTA recipe four earlier blocks carried is retired here. |
| Money is an integer in the currency's **minor unit** | Batch B's commerce contract, extended with `null` for unknown. |
| Numeric values carry `tabular-nums` and align right | Columns and totals line up across rows and between blocks. |

`src/blocks/finance.tsx` holds the shared pieces: `formatFinanceMoney`, `formatFinanceDate`, `FinanceDate`, `FinanceShell`, `FinanceHeader`, `FinanceActionControl`, `FinanceActionRow`, `FinanceFigureList`, `FinanceErrorPanel`, `FinanceEmptyPanel`, `FinanceLoadingNotice`, `FinanceSkeleton`, `FinanceStatusBadge` and the shared types. It mirrors `commerce.tsx`'s role for Batch B.

### Money, locale, dates

Currency, locale and time zone are props on every block, with `"GBP"` / `"en-GB"` as **defaults, not assumptions** — the same choice Batch B made. Amounts are minor-unit integers scaled by `Intl.NumberFormat(...).resolvedOptions().maximumFractionDigits`, so JPY prints whole yen from the same contract.

`formatFinanceDate` accepts `Date | number` (real instants, formatted with the supplied locale and `timeZone`), an ISO `string` (same treatment), or a string that does not parse as a date — which passes through verbatim. That last case is how a caller supplies an inherently fuzzy estimate such as `"1–2 business days"` without the block pretending to know a timestamp. A real instant renders inside `<time dateTime>`; a passed-through label does not. Each block also takes a `format*` escape hatch.

### There is still no `info` tone

Status tones are `neutral`, `success`, `warning`, `danger`. The palette carries `--color-info-400`/`-500` only: no `info` ground and no inverting `info` text role. This repeats Batch C's finding 4 rather than inventing a token.

---

## Account Balance

**File:** `src/blocks/AccountBalanceBlock.tsx` · **Plan idea 81**

View available, pending and total balances with currency and update time.

### Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Default `"Account balance"`. |
| `headingLevel` | `"h1"`–`"h6"` | Default `"h2"`. |
| `description`, `eyebrow` | `ReactNode` | The eyebrow is not a heading. |
| `account` | `{ name, reference?, icon? }` | Display only. `reference` must already be masked by the caller. |
| `status` | `FinanceStatus` | `{ label, tone?, description? }`. |
| `currency`, `locale` | `string` | Default `"GBP"` / `"en-GB"`. |
| `unknownLabel` | `string` | Default `"Not available"`. |
| `available`, `pending`, `total` | `number \| null \| undefined` | Minor units. `null` renders as words; `undefined` omits the figure. |
| `extraBalances` | `AccountBalanceEntry[]` | `{ id, label, amount, hint?, icon? }` for reserved, overdraft, incoming. |
| `primary` | `"available" \| "pending" \| "total"` | Default `"available"`. Which figure is the headline. |
| `availableLabel`, `pendingLabel`, `totalLabel` | `string` | Translatable. |
| `asOf` | `Date \| string \| number \| null` | `null` renders as unknown. |
| `asOfLabel`, `timeZone`, `formatAsOf`, `asOfNote` | | |
| `onRefresh`, `refreshLabel` | | The control is omitted entirely without the handler. |
| `balancesHidden`, `onToggleBalanceVisibility` | `boolean`, `() => void` | **Controlled only.** The block masks what it is told to mask and stores nothing. |
| `showBalancesLabel`, `hideBalancesLabel`, `hiddenValueLabel` | `string` | |
| `actions`, `actionsLabel` | `FinanceAction[]`, `string` | |
| `state` | `"default" \| "loading" \| "empty" \| "error"` | |
| `loadingMessage`, `errorTitle`, `errorDescription`, `onRetry` | | |
| `emptyTitle`, `emptyDescription`, `emptyAction` | | |
| `className` | `string` | Lands on the container root, outside the card padding. |

**Callbacks:** `onRefresh`, `onToggleBalanceVisibility`, `onRetry`, plus each action's own `onClick`.

### Total is never derived

`total` is supplied, never computed from `available + pending`. That arithmetic is wrong whenever a hold, a reserve or an arranged overdraft is involved, and the block cannot know which. If nothing at all is supplied, the block renders its empty explanation rather than a fabricated `£0.00`.

### States

- **default** — headline figure, secondary figures, update time, actions.
- **loading** — `aria-busy` section, `aria-hidden` placeholder shapes, one `role="status"` line.
- **error** — `role="alert"` panel; retry omitted without a handler.
- **empty** — no account. Wording is the caller's.
- **no figures supplied** — a second, distinct absence: there is an account but it reports no balance.
- **permission** — an action with `unavailableReason` renders disabled with the reason associated by `aria-describedby`.
- **success** — not applicable. The block submits nothing.

---

## Transfer Review

**File:** `src/blocks/TransferReviewBlock.tsx` · **Plan idea 82**

Review recipient, amount, fee, rate and arrival estimate before explicit confirmation. **It does not send money.**

### Props

| Prop | Type | Notes |
|---|---|---|
| `title`, `headingLevel`, `description`, `eyebrow`, `status` | | Default description states that nothing is sent until confirmation. |
| `recipient` | `TransferReviewParty` | Required. `{ name, reference?, institution?, detail?, avatar?, initials?, icon? }`. |
| `source`, `recipientLabel`, `sourceLabel` | | |
| `sendAmount` | `number \| null` | **Required prop, no default.** An amount the block invented would be its worst possible defect. |
| `sendCurrency` | `string` | **Required.** Never inferred from the locale. |
| `receiveAmount`, `receiveCurrency` | | The receive row appears only when `receiveCurrency` is supplied. |
| `fee`, `feeCurrency` | | `0` is a real fee; `null` is "not returned"; `undefined` omits the row. |
| `exchangeRate` | `{ from, to, rate, fractionDigits?, validity? } \| null` | `null` renders as unknown. |
| `totalDebited` | `number \| null` | Supplied, never derived: a fee may be added to or deducted from the amount. |
| `arrival` | `Date \| string \| null` | A non-date string passes through, e.g. `"1–2 business days"`. |
| `arrivalLabel`, `timeZone`, `formatArrival`, `arrivalNote` | | |
| `extraLines` | `TransferReviewLine[]` | `{ id, label, amount? \| text?, currency?, hint? }` for provider charges and codes. |
| `reference`, `referenceLabel` | | Display only. |
| `disclosure` | `ReactNode` | Provider terms, limits, regulatory text. |
| `requireAcknowledgement`, `acknowledgementLabel`, `onAcknowledgementChange` | | Adds a checkbox gate. Confirmation is impossible until it is ticked. |
| `onConfirm`, `confirmLabel` | | The control is omitted entirely without the handler. |
| `confirmUnavailableReason` | `string` | Permission / read-only. Disabled with the reason visible. |
| `onCancel`, `cancelLabel`, `onEditAmount`, `onEditRecipient` | | Each omitted entirely without its handler. |
| `state` | `"default" \| "loading" \| "pending" \| "error" \| "blocked"` | |
| `loadingMessage`, `pendingMessage`, `errorTitle`, `errorDescription`, `onRetry` | | |
| `blockedTitle`, `blockedDescription` | | |
| `result` | `{ title, description?, reference?, tone? }` | **Consumer-supplied only.** `tone` defaults to `"pending"` — accepted, not settled, which is the honest state for most rails. |
| `className` | `string` | |

**Callbacks:** `onConfirm`, `onCancel`, `onEditAmount`, `onEditRecipient`, `onAcknowledgementChange`, `onRetry`.

### The confirmation latch

`handleConfirm` refuses when confirmation is blocked, then sets an internal latch before calling `onConfirm`. The latch clears when `state` or the presence of `result` changes. Consequences, all deliberate:

- Pressing confirm twice calls `onConfirm` **once**. Asserted by `ConfirmationIsCounted`.
- A consumer that moves to `state="error"` gets a live control again, so the reader can retry.
- A consumer that changes nothing leaves the control disabled with a `role="status"` line, rather than permitting a second send.

Confirmation is additionally blocked while `state` is `loading`, `pending` or `blocked`, while `result` exists, when `confirmUnavailableReason` is set, and when an unticked acknowledgement is required.

### States

- **default** — parties, money rows, arrival, disclosure, decision controls.
- **loading** — quote not yet available.
- **pending** — in flight. Confirm disabled, `aria-busy`, `role="status"`. **Not success.**
- **error** — `role="alert"`; the review stays readable and confirm becomes live again.
- **blocked** — a `role="alert"` warning panel with a reason; confirm disabled. Used when a fee or rate is unknown.
- **permission** — `confirmUnavailableReason`.
- **success** — only from `result`. Never constructed.

---

## Invoice Detail

**File:** `src/blocks/InvoiceDetailBlock.tsx` · **Plan idea 83**

Inspect invoice lines, taxes, adjustments, amount due, status and payment actions.

### Props

| Prop | Type | Notes |
|---|---|---|
| `title`, `headingLevel`, `description` | | Default title `"Invoice"`. |
| `invoiceNumber` | `string` | Rendered as the eyebrow and as a metadata row. |
| `status` | `FinanceStatus` | |
| `currency`, `locale`, `unknownLabel`, `timeZone`, `formatDate` | | |
| `issuedOn`, `dueOn`, `issuedOnLabel`, `dueOnLabel` | | `null` renders as unknown. |
| `meta` | `{ id, label, value, icon? }[]` | Purchase order, project, tax id. |
| `billedTo`, `billedFrom` | `InvoiceParty` | `{ label?, lines }`, rendered as `<address>`. |
| `lines` | `InvoiceLine[]` | `{ id, description, detail?, quantity?, quantityUnit?, unitPrice?, amount }`. Negative amounts are credits. |
| `linesLabel`, `columnLabels` | | `linesLabel` names the table **and** its scroll region. Column headers are translatable. |
| `maxVisibleLines` | `number` | Default `12`. Beyond it the table enters a bounded scroll region. |
| `scrollRegionMaxHeight` | `string` | Default `"26rem"`. |
| `linesEmptyTitle`, `linesEmptyDescription`, `linesEmptyAction` | | Wording for an invoice with no lines — or a filtered view with no matches. |
| `subtotal`, `subtotalLabel` | | |
| `taxes`, `adjustments` | `InvoiceAdjustment[]` | `{ id, label, amount, detail? }`. Negative for discounts and credits. |
| `amountPaid`, `amountPaidLabel` | | |
| `amountDue` | `number \| null` | **Required.** Supplied, never derived from the lines. |
| `amountDueLabel`, `totalsLabel`, `amountDueNote` | | |
| `primaryAction`, `actions`, `actionsLabel` | | |
| `note` | `ReactNode` | Terms, remittance details. |
| `state` | `"default" \| "loading" \| "empty" \| "error"` | |
| `loadingMessage`, `errorTitle`, `errorDescription`, `onRetry`, `emptyTitle`, `emptyDescription`, `emptyAction` | | |
| `className` | `string` | |

**Callbacks:** `onRetry`, plus each action's own `onClick`.

### The table

A native `<table>` with `<thead>`, `scope="col"` column headers, and a `<th scope="row">` per line. There is **no visually hidden `<caption>`**: the table is named with `aria-labelledby` pointing at the visible sub-heading above it. That is deliberate — an absolutely positioned hidden element inside a scroll container is audit defect B03, and the same shape produced `KpiOverviewBlock`'s 200%-text overflow. Batch D avoids the shape by construction.

Below a **520px container** the unit-price column is withdrawn (`hidden @min-[520px]:table-cell`) and the unit price appears under the description instead. No data is lost. At enlarged text sizes, horizontal table overflow is contained in a named, keyboard-focusable area instead of widening the page.

Totals live in a named `<dl>` **outside** the scroll region, so they stay readable while a long invoice scrolls. A `<dl>` carries no `list` role, so it is found by its accessible name rather than by role.

### Two different absences, three different messages

- `state="empty"` — there is no invoice. `emptyTitle` / `emptyDescription`.
- `lines: []` with the invoice present — `linesEmptyTitle` / `linesEmptyDescription`.
- A filtered view with no matches — the same two props, different words, supplied by the caller. `FilteredWithNoMatches` demonstrates the distinction with a live filter.

### States

**default**, **loading**, **error** (retry optional), **empty** (no invoice), **lines-empty** (invoice with no lines), **filtered-empty**, **permission** (`primaryAction` with `unavailableReason`), **scrolling** (over `maxVisibleLines`). **success** — not applicable; the block pays nothing.

---

## Subscription Billing

**File:** `src/blocks/SubscriptionBillingBlock.tsx` · **Plan idea 84**

Manage the current plan, usage, renewal date, and the upgrade or cancellation flow. **It provisions and cancels nothing.**

### Props

| Prop | Type | Notes |
|---|---|---|
| `title`, `headingLevel`, `description`, `eyebrow`, `status` | | |
| `currency`, `locale`, `unknownLabel`, `timeZone`, `formatRenewal` | | |
| `plan` | `SubscriptionPlan` | Required. `{ name, description?, amount?, interval?, seats?, badge? }`. `amount: null` is an unknown price. |
| `planLabel` | `string` | Default `"Current plan"`. |
| `renewsOn`, `renewsOnLabel`, `renewalNote` | | `null` renders as unknown. |
| `nextChargeAmount`, `nextChargeLabel` | | Supplied, never derived from the plan price. |
| `paymentMethodSummary`, `paymentMethodLabel` | `ReactNode` | Display only, e.g. `"Visa ending 4242"`. Never full credentials. |
| `onManagePaymentMethod`, `managePaymentMethodLabel` | | Omitted entirely without the handler. |
| `usage` | `SubscriptionUsageMetric[]` | `{ id, label, used, limit?, unit?, formatValue?, note?, unlimitedLabel? }`. |
| `usageLabel`, `usagePeriod`, `usageEmptyTitle`, `usageEmptyDescription` | | |
| `upgradeOptions` | `SubscriptionPlanOption[]` | `{ id, name, description?, amount?, interval?, highlights?, recommended?, onSelect?, selectLabel?, unavailableReason? }`. Each option carries its own control. |
| `upgradeLabel`, `upgradeDescription` | | |
| `actions`, `actionsLabel` | | Billing history, tax details. |
| `onCancelConfirm` | `(reasonId?: string) => void` | The cancellation affordance is omitted entirely without it. |
| `onCancelRequest`, `onCancelDismiss` | | Panel opened / backed out of. |
| `cancelLabel`, `cancelConfirmLabel`, `cancelDismissLabel`, `cancelHeading`, `cancelExplanation` | | `cancelExplanation` states what actually happens — supplied, never assumed. |
| `cancelReasons`, `cancelReasonLabel`, `requireCancelReason` | | A native `<select>`; the reason gates confirmation when required. |
| `cancellationState` | `"idle" \| "pending" \| "error"` | |
| `cancellationPendingMessage`, `cancellationErrorTitle`, `cancellationErrorDescription` | | |
| `cancellationResult` | `{ title, description?, reference? }` | **Consumer-supplied only.** Its presence withdraws the cancellation affordance. |
| `readOnly`, `readOnlyReason` | | Withdraws **every** management control and states why. |
| `state` | `"default" \| "loading" \| "empty" \| "error"` | |
| `loadingMessage`, `errorTitle`, `errorDescription`, `onRetry`, `emptyTitle`, `emptyDescription`, `emptyAction` | | |
| `className` | `string` | |

**Callbacks:** `onCancelConfirm`, `onCancelRequest`, `onCancelDismiss`, `onManagePaymentMethod`, `onRetry`, each option's `onSelect`, each action's `onClick`.

### Cancellation

Two steps. The panel stays **mounted and hidden** so the toggle's `aria-controls` always resolves to a real element (audit B01). Backing out returns focus to the toggle. The confirm control latches on first press with the same mechanism as Transfer Review, keyed on `cancellationState` and `cancellationResult`.

Nothing about the plan, the status, the renewal date or the usage changes as a result of confirming. `CancellationIsTwoSteps` asserts that after confirming, the status still reads `"Active"` and no text matching `/cancelled|canceled/i` appears anywhere.

### Usage bars

A `ProgressBar` is rendered only when `used` **and** `limit` are both real numbers and `limit > 0`. When a figure is `null` the block prints "A figure is missing, so no proportion is shown", and when `limit` is `undefined` it prints the unlimited explanation. An empty bar would read as zero use, which is a fabricated figure.

### States

**default**, **loading**, **error**, **empty** (no subscription), **usage-empty**, **read-only** (`readOnly` + reason), **permission** (a plan option with `unavailableReason`), **cancellation idle / open / pending / error**, and **cancellation result** — consumer-supplied only.

---

## The composition

**File:** `src/blocks/FinanceOverviewComposition.stories.tsx`

A finance overview assembling **Account Balance** and **Invoice Detail** (Batch D) with the two existing repaired blocks, **QuickSendBlock** and **RecentTransactionsBlock**, plus **Transfer Review** in the interactive variant. Five stories: the page, a Quick Send → Transfer Review flow, a forty-line invoice inside the page, a dark composition, and a 360px composition.

Composing across the batch boundary is what the plan asks a composition to do, and it found four things.

1. **A grid, never a shrink-to-fit flex row.** A block root carries `container-type: inline-size`, which contributes **0** to max-content. Any shrink-to-fit parent therefore collapses it to nothing while its contents still paint outside the box — visible, and passing `toBeVisible()`. The composition uses `grid-cols-[minmax(0,1fr)]` tracks. This is Batch C's collapsed-switcher defect in a new disguise; see "What the measurements found" below, where it also broke every story file before they were moved to `layout: "fullscreen"`.
2. **The heading outline works, but only because Batch D blocks sit at `h2`.** The page owns one `h1`; Account Balance, Transfer Review and Invoice Detail render `h2`; Quick Send and Recent Transactions render a hard-coded `h3`. `FinanceOverviewPage` asserts exactly one `h1` and no level increasing by more than one. In the Quick Send → Transfer Review story, where the two existing blocks appear **before** any `h2`, the composition has to supply its own `h2` or axe reports `heading-order`. That is a real limitation of the two existing blocks, recorded under "Inconsistencies" below.
3. **One vertical scroll region, no horizontal one.** `LongInvoiceInComposition` asserts that exactly one element on the page is a bounded vertical scroll region, that it is the invoice table's, and that `document.documentElement.scrollWidth` does not exceed `clientWidth`.
4. **Money is formatted once, at page level.** The page holds `CURRENCY` / `LOCALE` / `TIME_ZONE` and passes them down, because `RecentTransactionsBlock` takes pre-formatted strings while Batch D blocks take minor-unit integers. The composition formats the transaction strings with `formatFinanceMoney` so the two families cannot disagree.

---

## Verification

Measured 23 September 2026 with the repository's own Storybook vitest runner, driven by Google Chrome through the `PLAYWRIGHT_EXECUTABLE_PATH` override because the bundled Playwright chromium revision is missing. `vitest.config.ts` was not edited.

| Check | Result |
|---|---|
| `pnpm typecheck` | Passes. |
| ESLint on the ten new files | Clean: 0 errors, 0 warnings. |
| Prettier on the ten new files | Formatted; `--check` clean. |
| Storybook vitest runner, Batch D scope | **5 files, 64 stories, all passing**, with `a11y: { test: "error" }` on every file, so any axe violation fails the test. Exit code captured directly, not through a pipe. |
| Per-file runs | Account Balance 14, Transfer Review 14, Invoice Detail 14, Subscription Billing 17, composition 5. |
| axe-core 4.11.1 | Runs inside every one of the 64 stories, at the runner's 1200×900 viewport, via the addon's `test: "error"` mode. **0 violations remain.** |
| Interaction checks | **13 of the 64 stories carry `play` functions** making behavioural assertions, not render smoke tests. |
| Bounded scroll | `FortyLinesScroll` asserts `scrollHeight > clientHeight`, `clientHeight ≤ 480px`, `scrollWidth ≤ clientWidth + 1`, that scrolling the region does not move the page, that the totals list is outside the region, and that the region takes focus. |
| Document width | Asserted inside `FortyLinesScroll`, `NarrowContainers` (Invoice Detail), and three composition stories: `document.documentElement.scrollWidth ≤ clientWidth`. |
| Narrow containers | 288px and 420px columns on every block, plus a 360px composition, all at the runner's own viewport — the blocks read their own width. |
| Themes | Light, a `.rayden-dark` island, and a consumer sage palette scoped to `.rayden-light`, for each of the four blocks and the composition; all included in the clean axe scans. |
| **Viewport sweep** | **152 checks**: 19 stories × 320 / 390 / 768 / 1440 × light and dark, driven by Playwright against the project's own Storybook dev server. **0 document overflows and 0 horizontal scroll regions originating in Batch D code.** |
| **Independent axe run** | **108 scans**: 18 stories × 320 / 390 / 1440 × light and dark, axe-core 4.11.1 across `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`. **0 violations in Batch D code.** |
| **Keyboard walk** | **39 tab stops across 9 fixtures at 1440px.** Every stop carried a visible focus indicator — an outline of at least 1px or a box-shadow ring. **0 stops without one.** |
| **Visual review** | Six screenshots inspected: the composition at 1440 in light and dark, Transfer Review cross-currency at 390, the 40-line invoice at 390, Subscription Billing at 768 dark, and the 288/420px Account Balance pair at 1440. |

### What the harness measured

The Playwright harness drove the **project's own Storybook dev server**, never a standalone Vite root: a harness rooted outside the repository makes Tailwind's source detection miss `src/blocks`, so block-only utilities silently do not compile and an unstyled block measures clean. Every harness exit code was captured directly rather than through a pipe, because `cmd | tail` returns tail's status.

- **Viewport sweep, 152 checks.** Two `document.documentElement.scrollWidth > clientWidth` results, both from `NarrowComposition` at a 320px viewport, where the story's own fixture is a fixed `w-[360px]` column — the fixture is wider than the viewport by construction. No Batch D block overflowed at any width in either theme.
- **Sixteen horizontal scroll regions, none of them Batch D's.** Every one resolved to `DIV.flex gap-5 overflow-x-auto` — **QuickSendBlock's** beneficiary row, reached only through the composition stories. Recorded under "Inconsistencies" below.
- **Independent axe run, 108 scans, three rule types, none a Batch D defect.** `landmark-one-main` (108) and `page-has-heading-one` (96) both report the `<html>` node and fire because a standalone block is rendered in a Storybook iframe rather than a page; the 12 scans that do not report `page-has-heading-one` are the two composition stories, which supply an `h1`. `region` (12) fires **only** on the two composition stories, and its target selector resolves to the `text-lg` heading of `QuickSendBlock` / `RecentTransactionsBlock`, which sit outside any landmark because those blocks render a bare `<div>`. Every Batch D block renders `<section aria-labelledby>`, so its own content is inside a named region. This repeats Batch C's finding about standalone-in-iframe scans.
- **Keyboard walk, 39 stops, 0 without a focus indicator.** Notably this includes the shared `Button` in both `as="a"` and `button` forms, the native `<select>` in the cancellation panel, the acknowledgement checkbox, and the invoice scroll region — which Batch C could not say, because five of its 84 stops were shared `Input`/`Checkbox` components whose focus treatment is a border-colour change with no ring. Batch D does not compose those two components.

### What the measurements found

Seven defects were found by measurement rather than by review. All seven are fixed.

1. **Every story collapsed to 0px wide, at every viewport, and looked fine.** Storybook's `layout: "padded"` wraps a story in `.rayden-story-frame`, a flex column with `align-items: center`, which makes the story a shrink-to-fit flex item. A root carrying `container-type: inline-size` contributes 0 to max-content, so the island wrapper resolved to **32px** (its own padding) and the block painted entirely outside its own box. Probed directly: the `@container` root measured `0×1479`, its section `34×1479`, and a "Hide balances" label sat at x=652 inside a 32px-wide parent. Every layout assertion still passed and every screenshot looked correct. It surfaced only as an axe `color-contrast` failure, because axe's hit-testing found no painted ancestor and fell back to the page's white. Fixed by moving all four story files to `layout: "fullscreen"` with an explicit-width decorator. **This is Batch C's collapsed-switcher defect recurring, and it is the second time `container-type: inline-size` has silently zeroed a block.**
2. **Two nested `role="status"` regions.** `Spinner` is itself a `role="status"`, so putting one inside the block's own status line produced two live regions announcing the same thing, and made `getByRole("status")` ambiguous. Every decorative spinner is now wrapped in `aria-hidden="true"`, leaving the message as the sole announcement.
3. **An invalid `<dl>`.** The secondary-balance groups held `<dt>`, `<dd>` and a sibling `<p>` hint. axe's `definition-list` rule rejects it; the hint now lives inside the `<dd>`.
4. **Two blocks on one page were two regions with the same name.** Rendering Account Balance twice in the narrow-container story produced two `section` landmarks both called "Account balance" (`landmark-unique`). Fixed in the fixture with distinct titles — and it is a genuine constraint on consumers, recorded under "Known limitations".
5. **The primary action was rendered twice** in Invoice Detail: once in the header and again in the action row. A duplicated control, removed from the header.
6. **The totals `<dl>` had an `sr-only` heading.** Replaced with `aria-label`, so the block contains no absolutely positioned hidden element at all — the B03 shape is now absent by construction rather than merely contained.

7. **Every container query in the composition was inert.** The composition's page root was not a `@container`, so its `@min-[1000px]` two-column rule never matched and the overview rendered as one column at 1440px. Caught by looking at a screenshot, not by any assertion — every test still passed, because a single-column page is a valid layout. `@container` added to the composition root.

Four fixture errors were also caught by the `play` functions rather than by review: three minor-unit miscalculations (`251_50` read as £251.50, not £2,501.50) and one over-broad regex, where an assertion that the block claims no success matched the block's own honest sentence "Nothing is **sent** until you confirm."

### Release gates

| Gate | Status |
|---|---|
| 1. Visual review | **Pass.** Six screenshots inspected at 1440 / 768 / 390 in both modes, plus direct computed-style probes of the dark island (`bg` `rgb(29,39,57)`, section `rgb(16,25,40)`, foreground `rgb(240,242,245)`). Hierarchy, tabular alignment, negative amounts and dark mode read correctly; no clipping or overlap found. This is where the inert container query in the composition was caught — no assertion could see it. |
| 2. Responsive review | **Pass.** 152 checks across 320 / 390 / 768 / 1440 in both themes, plus narrow parent containers of 288px, 360px and 420px on a wide viewport. 0 document overflows and 0 horizontal scroll regions in Batch D code. **200% root text sizing was not measured.** |
| 3. Semantics and keyboard | **Pass as far as it was tested.** 64 in-runner axe scans plus 108 independent scans, all clean for Batch D; native table with `scope`; labelled `<dl>` and `<address>`; `aria-controls` asserted to resolve on the cancellation toggle while closed; focus restoration asserted on cancellation dismiss; the invoice scroll region asserted focusable. **39 tab stops walked across 9 fixtures, every one with a visible focus indicator.** **No screen-reader pass** and no non-Chromium engine. |
| 4. Contrast and targets | **Pass.** 0 contrast violations across 64 in-runner scans and 108 independent scans, in light, dark and a consumer palette, at 320 / 390 / 1440. Controls carry a 40px minimum height and the two confirm controls 48px. Target size was not measured per control. |
| 5. Theming | **Pass.** Light, `.rayden-dark`, and a consumer palette scoped to `.rayden-light` for all four blocks and the composition, all in the clean scans. Batch D uses the `on-surface` foreground family throughout, so a consumer overriding `--color-surface` gets a matching foreground without also overriding the grey ramp. |
| 6. Interaction checks | **Pass.** 13 `play` functions making real assertions: the confirmation fires exactly once under three presses; the block renders no success state of its own; an acknowledgement gate blocks and unblocks; a 40-line invoice scrolls within a bounded region without widening the document; a filter distinguishes "no lines" from "no matches"; cancellation is two steps, passes its reason, fires once, and leaves the status unchanged; focus returns to the toggle on dismiss; Quick Send → Transfer Review confirms once end to end. |
| 7. Distribution | **Not met, deliberately.** Not exported from `src/blocks/index.ts`, no catalog or AI manifest entry, no documentation page. Another agent owns those files this round. The four blocks introduce no optional dependency. |

## Inconsistencies found against the existing finance blocks

These are findings about `QuickSendBlock` and `RecentTransactionsBlock`, observed while composing with them. **Neither file was edited** — Batch D creates new files only, and both were in another agent's scope this round.

1. **No heading-level contract.** Both hard-code `<h3>`. A composition cannot place them freely: in the Quick Send → Transfer Review story, where they precede any `h2`, the composition must supply its own intervening `h2` or axe reports `heading-order`. Every block from Batch A onwards takes `headingLevel`.
2. **Raw grey foregrounds, not the surface family.** Both use `text-grey-900` / `text-grey-500` where Batch D uses `text-on-surface` / `-muted`. A consumer who overrides `--color-surface` alone gets a coherent Batch D block and an incoherent Quick Send beside it — exactly the half-override failure the `on-surface` family was added to prevent. This is Batch C's finding 3, still open in these two blocks.
3. **Pre-formatted money strings.** `Transaction.amount` is a `string`, and the sign is prepended as a separate text node (`{isOutgoing ? "-" : "+"} {tx.amount}`). Batch D and Batch B both take minor-unit integers with `currency` and `locale`. The composition therefore formats the strings itself so the two families agree, and the composition's assertion has to normalise whitespace across the split text nodes.
4. **No container queries and no `@container`.** Neither block adapts to its own width. In practice this made them *easier* to compose — they cannot collapse the way a `container-type: inline-size` root can — but they also cannot respond to a narrow column.
5. **The only horizontal scroll regions measured on any Batch D surface belong to `QuickSendBlock`.** The viewport sweep found 16, every one `DIV.flex gap-5 overflow-x-auto` — the beneficiary row — at 320, 390, 768 and 1440 in both themes. It has no `role`, no accessible name and no `tabIndex`, so it cannot be scrolled from the keyboard, and the container is not `relative`. Each beneficiary is a bare `<button>` whose visible name is a `max-w-[80px] truncate` span; the accessible name is the full text, so the buttons themselves are operable.

6. **Neither block sits inside a landmark.** The independent axe run reported `region` on the two composition stories only, targeting the `text-lg` headings of `QuickSendBlock` and `RecentTransactionsBlock`: both render a bare `<div>`, so their content is outside any landmark. Every Batch D block renders `<section aria-labelledby>`.

7. **The heading sits outside the card.** Visible in the composition screenshot: both existing blocks place their `h3` above their surface, while every Batch D block places its heading inside. Stacked in one column the two treatments do not line up.
8. **No states.** Neither block defines loading, error, empty or permission states; passing an empty array renders an empty card with a heading.

None of these blocked the composition. Items 1, 2, 3 and 5 are the ones a consumer would notice first.

## Known limitations

- **No 200% root-text pass**, no screen-reader pass, no non-Chromium engine, and no operating-system text-size or full-browser-zoom test. These are the remaining verification gaps.
- **Target size was measured only as a minimum control height**, not per control.
- **A `container-type: inline-size` root cannot shrink to fit.** Placing a Batch D block in a shrink-to-fit parent — an `inline-block`, a flex item under `align-items: center`, an auto-sized grid track — collapses it to 0px while its contents still paint. It looks fine and passes `toBeVisible()`. Give it a grid track, an explicit width, or `align-self: stretch`. This cost this batch real time and cost Batch C real time; it deserves a lint rule or a documented placement contract.
- **Two instances of the same block on one page need distinct `title`s**, or they are two `region` landmarks with the same accessible name.
- **The latch on both confirm controls assumes the consumer responds.** A consumer that calls neither a state change nor a result leaves the control disabled. That is the safe direction for a payment, but it is a contract a consumer must know about.
- **`amountDue`, `totalDebited` and `nextChargeAmount` are never derived.** A consumer that forgets to supply them gets an omitted row, not a computed one. Deliberate, and worth stating in the public docs.
- **Invoice Detail's bounded scroll region is a vertical scroll container inside the page.** The plan permits an intentionally bounded table scroll area, and the composition asserts it is the only one, but it is still a second scroll axis a consumer may not want. `maxVisibleLines` can be set arbitrarily high to disable it.
- **No `info` status tone**, because the token family does not exist. See Batch C's finding 4.
