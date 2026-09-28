# Blocks

Pre-built UI blocks that combine Rayden UI components into complete task patterns. Blocks
provide the interface and the callbacks; data, persistence and outcomes belong to your
application.

**This page is an index.** The authoritative contract for each block — its full prop table,
states, verification record and known limitations — lives on its own documentation page under
[`packages/docs/content/blocks/`](../packages/docs/content/blocks/). Earlier revisions of this
file duplicated prop tables that drifted out of step with the source (audit finding B12); it
no longer repeats them.

The machine-readable catalog is authored in
[`packages/rayden-ai/src/blocks.json`](../packages/rayden-ai/src/blocks.json) and published
under `blocks` in `packages/docs/public/ai/catalog.json`.

## Status

All 28 blocks are **`experimental`**: publicly exported, documented and story-covered, with an
incomplete release-gate record. None has had a screen-reader pass, a second browser engine, or
an operating-system text-size test, so none carries the `stable` status the
[expansion plan](blocks-expansion-plan.md) reserves for the public supported count.

The catalog records a second field, `verificationLevel`, because those five statuses cannot
distinguish an entry measured incompletely from one not measured at all. Twenty-four entries are
`measured`. The four finance blocks are `unmeasured`: no verification run exists for them yet.

## Import

```tsx
import { LoginBlock, PricingPlansBlock, ShoppingCartBlock } from "@raydenui/ui/blocks";
import type { PricingPlan, CommerceCartItem } from "@raydenui/ui/blocks";
```

## The library

| Block | Category | Task | Page |
|---|---|---|---|
| `HeaderBlock` | Navigation & shells | Navigate a public site | [header-block](../packages/docs/content/blocks/header-block.mdx) |
| `ApplicationShellBlock` | Navigation & shells | Compose an application frame | [application-shell-block](../packages/docs/content/blocks/application-shell-block.mdx) |
| `PageHeaderBlock` | Navigation & shells | Establish page context and actions | [page-header-block](../packages/docs/content/blocks/page-header-block.mdx) |
| `WorkspaceSwitcherBlock` | Navigation & shells | Find and switch a workspace | [workspace-switcher-block](../packages/docs/content/blocks/workspace-switcher-block.mdx) |
| `CommandPaletteBlock` | Navigation & shells | Search destinations and actions | [command-palette-block](../packages/docs/content/blocks/command-palette-block.mdx) |
| `SiteFooterBlock` | Navigation & shells | Browse grouped site destinations | [site-footer-block](../packages/docs/content/blocks/site-footer-block.mdx) |
| `LoginBlock` | Authentication & onboarding | Authenticate | [login-block](../packages/docs/content/blocks/login-block.mdx) |
| `CreateAccountBlock` | Authentication & onboarding | Register | [create-account-block](../packages/docs/content/blocks/create-account-block.mdx) |
| `KpiOverviewBlock` | Dashboards & analytics | Compare metrics for a period | [kpi-overview-block](../packages/docs/content/blocks/kpi-overview-block.mdx) |
| `TableBlock` | Data & records | Inspect and select payment records | [table-block](../packages/docs/content/blocks/table-block.mdx) |
| `SearchableTableBlock` | Data & records | Search, sort and act on records | [searchable-table-block](../packages/docs/content/blocks/searchable-table-block.mdx) |
| `ProfileSettingsBlock` | Forms & settings | Edit a profile | [profile-settings-block](../packages/docs/content/blocks/profile-settings-block.mdx) |
| `NotificationsBlock` | Collaboration & workflow | Read a notification feed | [notifications-block](../packages/docs/content/blocks/notifications-block.mdx) |
| `TaskListBlock` | Collaboration & workflow | Manage actionable work | [task-list-block](../packages/docs/content/blocks/task-list-block.mdx) |
| `ProductHeroBlock` | Marketing & conversion | Explain a product | [product-hero-block](../packages/docs/content/blocks/product-hero-block.mdx) |
| `FeatureOverviewBlock` | Marketing & conversion | Scan capabilities | [feature-overview-block](../packages/docs/content/blocks/feature-overview-block.mdx) |
| `PricingPlansBlock` | Marketing & conversion | Compare plans | [pricing-plans-block](../packages/docs/content/blocks/pricing-plans-block.mdx) |
| `ProductCollectionBlock` | Commerce | Browse products | [product-collection-block](../packages/docs/content/blocks/product-collection-block.mdx) |
| `ProductDetailBlock` | Commerce | Inspect a product and add to cart | [product-detail-block](../packages/docs/content/blocks/product-detail-block.mdx) |
| `ShoppingCartBlock` | Commerce | Review and change a cart | [shopping-cart-block](../packages/docs/content/blocks/shopping-cart-block.mdx) |
| `CheckoutReviewBlock` | Commerce | Review an order before placing it | [checkout-review-block](../packages/docs/content/blocks/checkout-review-block.mdx) |
| `QuickSendBlock` | Finance & billing | Select a beneficiary | [quick-send-block](../packages/docs/content/blocks/quick-send-block.mdx) |
| `RecentTransactionsBlock` | Finance & billing | Inspect recent transactions | [recent-transactions-block](../packages/docs/content/blocks/recent-transactions-block.mdx) |
| `AccountBalanceBlock` | Finance & billing | View available, pending and total balances · **unmeasured** | [account-balance-block](../packages/docs/content/blocks/account-balance-block.mdx) |
| `TransferReviewBlock` | Finance & billing | Review a transfer before confirmation · **unmeasured** | [transfer-review-block](../packages/docs/content/blocks/transfer-review-block.mdx) |
| `InvoiceDetailBlock` | Finance & billing | Inspect an invoice and its payment actions · **unmeasured** | [invoice-detail-block](../packages/docs/content/blocks/invoice-detail-block.mdx) |
| `SubscriptionBillingBlock` | Finance & billing | Manage a plan, usage, renewal and cancellation · **unmeasured** | [subscription-billing-block](../packages/docs/content/blocks/subscription-billing-block.mdx) |
| `EmptyStateBlock` | System states & utilities | Explain an absence of content | [empty-state-block](../packages/docs/content/blocks/empty-state-block.mdx) |

Composition guides: [application chrome](../packages/docs/content/blocks/navigation.mdx) and
[commerce journey](../packages/docs/content/blocks/commerce.mdx).

## Shared contracts

**Nothing is fetched.** Every block exposes callbacks and fetches nothing.

**Nothing is manufactured.** A block never claims a success your application has not
confirmed. Where a success is meaningful it is a prop you pass (`notice`, `confirmation`,
`successMessage`, `status="success"`); where it is not, the block has no success state.

**Availability is explicit.** A control renders only when its handler is supplied, is
explicitly disabled with a visible reason, or is omitted entirely.

**Layouts follow their container**, not the viewport.

**Heading levels are a contract.** `headingLevel` is the element name, `"h1"` through
`"h6"`, and sub-headings derive from it. Most blocks default to `"h2"`; `ProductHeroBlock`
and `PageHeaderBlock` default to `"h1"`. `SiteFooterBlock`'s `groupHeadingLevel` accepts
`"h2"`–`"h6"` only.

**Money conventions differ between families.** The commerce blocks take non-negative integers
in the currency's **minor** unit (GBP 2400 is £24.00). `PricingPlansBlock` takes amounts in the
**major** unit. `TableBlock` and `RecentTransactionsBlock` take pre-formatted strings.

## Per-block notes

These anchors exist so older links keep resolving. Follow the page link for the contract.

### LoginBlock

Variants are `"standard" | "card" | "work-email"`. `socialProviders` is an array of
`{ name, icon, onClick? }` objects — **not** provider-name strings — and there is no
block-level social callback. `onSubmit` receives `{ email, password, rememberMe }`.
→ [login-block](../packages/docs/content/blocks/login-block.mdx)

### NotificationsBlock

Takes `items`, not `notifications`. There is no `onItemClick` and no `onMarkAllRead`: the block
marks nothing read. `headingLevel` is now the string union `"h1"`–`"h6"` defaulting to `"h2"`,
replacing a numeric `2 | 3 | 4 | 5 | 6` union that defaulted to `3`.
→ [notifications-block](../packages/docs/content/blocks/notifications-block.mdx)

### TableBlock

A **payment records** table with a fixed row shape — there is no `columns`, `title`,
`description`, `onRowClick` or `pagination` object. Pagination is `page` + `totalPages` +
`onPageChange` together, and the actions column needs `onRowAction`. Selection is
`selectedIds` + `onSelectionChange`, with a documented reconciliation contract.
→ [table-block](../packages/docs/content/blocks/table-block.mdx)

### SearchableTableBlock

Takes `rows`, not `data`. There is no `filters` array, no `onFilterChange` and no `pagination`
object. The filter and date-selector buttons require `onFilter` and `onDateSelect`; `showFilter`
and `showDateSelector` can only hide them. A column's `render` receives `(value, row)`.
→ [searchable-table-block](../packages/docs/content/blocks/searchable-table-block.mdx)

### QuickSendBlock

Selects a beneficiary. It does **not** collect an amount and does not send money, so there is
no `onSend` — the callback is `onSelect(id)`.
→ [quick-send-block](../packages/docs/content/blocks/quick-send-block.mdx)

### RecentTransactionsBlock

Callbacks are `onSeeAll` and `onTransactionClick`; there is no `onViewAll`. A `Transaction` is
`{ id, direction, name, category, amount }` with `amount` pre-formatted — there is no `title`,
`date` or `icon`.
→ [recent-transactions-block](../packages/docs/content/blocks/recent-transactions-block.mdx)

### EmptyStateBlock

`variant` selects the **wrapper** and is `"inline" | "card"` — not an illustration set and not
`"default"`. The illustration is the separate required `illustration` prop, whose nineteen
valid names are listed on the page. There is exactly one `action`; there is no
`primaryAction`/`secondaryAction` pair.
→ [empty-state-block](../packages/docs/content/blocks/empty-state-block.mdx)

## Customization

`className` lands on each block's own container root:

```tsx
<TableBlock className="rounded-xl shadow-soft-lg" rows={rows} />
```

Semantic surface, border, text and action roles control intended theming — see
[design tokens](design-tokens.md). Overriding `--color-surface` alone is not sufficient: pair
it with the matching `--color-on-surface*` foreground roles.
