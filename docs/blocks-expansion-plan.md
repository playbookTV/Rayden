# Rayden blocks: balanced catalog proposal

Status: category structure and counts confirmed by the owner, 21 September 2026. The owner selected a balanced mix of application UI, marketing, commerce, and finance and approved the 12 categories and 100-block distribution below. Individual ideas and delivery ordering remain proposals, not shipped capabilities or release commitments.

## Product brief

Help broad product teams find a complete, composable interface pattern for a real task, preview its behavior, and adapt it to their product. Preserve Citrionus's confirmed calm, approachable styling and orange accent. Make 80 dependable core blocks the first catalog target; extend to 100 when the same quality requirements can be maintained.

The primary catalog action is **find a suitable block, inspect its states, and use it**. A block is a composed task or section with a coherent data and interaction contract. A primitive, color option, dark mode, loading state, or alternate alignment is not an additional block. A page assembled from several blocks is a template and has its own catalog.

Current baseline: **7 exported blocks**, plus **1 internal Header implementation**. The Header is not available through the public blocks entry. The current TableBlock is a payment-specific table despite its broad name. Preserve existing public import names; add clearer display names and aliases in discovery rather than breaking consumers.

## Categories and counts

One primary category per block prevents double counting. Cross-category discovery uses tags.

| Category | Core | Extensions | Total | Existing implementations |
|---|---:|---:|---:|---|
| Navigation & shells | 6 | 2 | 8 | Header, internal |
| Authentication & onboarding | 6 | 2 | 8 | Login |
| Dashboards & analytics | 6 | 2 | 8 | — |
| Data & records | 6 | 2 | 8 | Table, Searchable Table |
| Forms & settings | 6 | 2 | 8 | — |
| Collaboration & workflow | 6 | 2 | 8 | Notifications |
| Marketing & conversion | 10 | 2 | 12 | — |
| Content & community | 6 | 2 | 8 | — |
| Commerce | 10 | 0 | 10 | — |
| Finance & billing | 6 | 2 | 8 | Quick Send, Recent Transactions |
| Support & feedback | 6 | 0 | 6 | — |
| System states & utilities | 6 | 2 | 8 | Empty State |
| **Total** | **80** | **20** | **100** | **7 public + 1 internal** |

## Proposed catalog

Numbers identify ideas in this plan only. “Core” includes the existing blocks after repair. “Extension” means part of the final 20, not a premium licensing decision.

### Navigation & shells

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 01 | Site Header | Core · internal | Navigate a public site with equivalent desktop and mobile destinations; promote HeaderBlock only after verification. |
| 02 | Application Shell | Core | Compose sidebar, workspace area, top bar, and mobile navigation without losing destinations. |
| 03 | Page Header & Actions | Core | Establish page context with breadcrumbs, title, status, and a prioritised action group. |
| 04 | Workspace Switcher | Core | Find and switch a workspace, see the current one, and create or join another. |
| 05 | Site Footer | Core | Browse grouped site links, legal information, social destinations, and locale controls. |
| 06 | Command Palette | Core | Search and activate application destinations and actions with keyboard support. |
| 07 | Resource Detail Shell | Extension | Navigate an entity's overview, related records, and activity while retaining entity context. |
| 08 | Documentation Shell | Extension | Browse a documentation tree, local contents, version selector, and previous/next articles. |

### Authentication & onboarding

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 09 | Sign In | Core · public | Authenticate with credentials or configured providers; existing LoginBlock. |
| 10 | Create Account | Core | Register with field validation, password guidance, and required consent. |
| 11 | Password Recovery | Core | Request a reset and set a new password, including expired-link and success states. |
| 12 | Verification Challenge | Core | Enter or paste a verification code, resend it, and recover from expiry. |
| 13 | Welcome Checklist | Core | Complete and revisit initial setup tasks with persistent progress supplied by the app. |
| 14 | Team Invitation | Core | Invite multiple teammates, assign initial roles, and resolve invalid or duplicate addresses. |
| 15 | Passkey Setup | Extension | Enrol a passkey with supported-device, cancellation, fallback, and completion states. |
| 16 | Organisation Setup | Extension | Create a workspace across named steps, save progress, and resume incomplete setup. |

### Dashboards & analytics

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 17 | KPI Overview | Core | Compare labelled metrics against an explicit period with trends and textual context. |
| 18 | Time-Series Explorer | Core | Inspect a metric across time, change period, and access equivalent tabular data. |
| 19 | Category Breakdown | Core | Compare meaningful categories, totals, and shares with an accessible data view. |
| 20 | Conversion Funnel | Core | Inspect stage counts, conversion rates, and drop-off across a defined journey. |
| 21 | Goal Progress | Core | Understand progress toward goals, target dates, and remaining work. |
| 22 | Operational Status | Core | Inspect service or job health, last update, and actionable incidents. |
| 23 | Cohort Retention | Extension | Compare retention by cohort and time period with a readable table alternative. |
| 24 | Geographic Performance | Extension | Compare regional results in a ranked list, with an optional map enhancement. |

### Data & records

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 25 | Payment Records Table | Core · public | Inspect and select payment records; retain the TableBlock export while clarifying its display name. |
| 26 | Searchable Records Table | Core · public | Search, sort, select, and act on configurable records; existing SearchableTableBlock. |
| 27 | Record Detail | Core | Read grouped entity attributes, status, ownership, and available record actions. |
| 28 | Record Collection | Core | Browse image or document records with list/grid views, sort order, and selection. |
| 29 | Saved Views & Filters | Core | Build filter conditions, save a view, and restore a named record query. |
| 30 | CSV Import Review | Core | Map imported columns, inspect invalid rows, and confirm valid data before import. |
| 31 | Record Comparison | Extension | Compare selected entities field by field and identify differences. |
| 32 | Audit Log | Extension | Inspect who changed what and when, filter events, and view before/after values. |

### Forms & settings

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 33 | Profile Settings | Core | Edit personal details and avatar, track unsaved changes, and save or cancel. |
| 34 | Workspace Settings | Core | Change shared workspace identity and preferences with permission-aware editing. |
| 35 | Notification Preferences | Core | Set event/channel subscriptions, including unavailable or mandatory notifications. |
| 36 | Security Settings | Core | Manage credentials, sessions, and second-factor methods with step-up confirmation. |
| 37 | Integration Settings | Core | Connect, reconnect, configure, and disconnect an external service with truthful status. |
| 38 | Multi-Step Form | Core | Complete a named sequence with validation, back navigation, and final review. |
| 39 | Roles & Permissions | Extension | Inspect and edit role capabilities with clear inherited and restricted states. |
| 40 | API Key Management | Extension | Create, name, reveal once, rotate, and revoke credentials through app callbacks. |

### Collaboration & workflow

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 41 | Notifications Inbox | Core · public | Read a contextual notification feed and follow available actions; existing NotificationsBlock. |
| 42 | Activity Timeline | Core | Follow a grouped history of work on an entity, with dates and linked events. |
| 43 | Comment Thread | Core | Read, reply, edit, and resolve contextual discussions with permission states. |
| 44 | Team Directory | Core | Find teammates by name, role, or team and open their profiles. |
| 45 | Task List | Core | Add, assign, complete, and filter actionable work with due-date context. |
| 46 | Approval Queue | Core | Review requests, inspect supporting information, and approve or reject with feedback. |
| 47 | Kanban Board | Extension | Move work through stages using pointer and equivalent keyboard controls. |
| 48 | Schedule Agenda | Extension | Browse dated events, switch periods, and inspect or create an appointment. |

### Marketing & conversion

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 49 | Product Hero | Core | Explain the product, show a relevant example, and lead to a primary next step. |
| 50 | Feature Overview | Core | Scan differentiated capabilities and follow details that matter to the visitor. |
| 51 | Feature Walkthrough | Core | Explore a capability through ordered steps or selectable product examples. |
| 52 | Use-Case Explorer | Core | Choose a role or use case and see matching benefits, evidence, and actions. |
| 53 | Customer Proof | Core | Read attributable testimonials or customer logos with useful contextual evidence. |
| 54 | Case Study Spotlight | Core | Understand a customer's problem, solution, and evidenced outcome. |
| 55 | Pricing Plans | Core | Compare plans, switch billing period, and understand included usage and limits. |
| 56 | Plan Comparison | Core | Compare detailed entitlements and limitations across plans. |
| 57 | FAQ Section | Core | Find clear answers to purchase or adoption questions with accessible disclosure. |
| 58 | Demo Request | Core | Submit a qualified enquiry, understand next steps, and recover from failure. |
| 59 | Launch Announcement | Extension | Understand a significant release with a date, key changes, and a next action. |
| 60 | Newsletter Signup | Extension | Subscribe with explicit expectations and confirmation, duplicate, and failure states. |

### Content & community

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 61 | Article Index | Core | Discover editorial content by category, search, and publication date. |
| 62 | Article Reader | Core | Read long-form content with author information, contents, and related reading. |
| 63 | Resource Library | Core | Find guides, downloads, and recordings by topic and content type. |
| 64 | Changelog | Core | Follow product changes by version, date, and change type. |
| 65 | Event Listing | Core | Browse events by date, location, and format, then open details or register. |
| 66 | Community Discussion | Core | Browse topics with participation and resolution context, then open or start one. |
| 67 | Public Profile | Extension | Explore a person's biography, work, contributions, and contact destinations. |
| 68 | Media Gallery | Extension | Browse visual work, inspect a selected item, and access captions or descriptions. |

### Commerce

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 69 | Product Collection | Core | Browse products with prices, availability, filters, and useful sorting. |
| 70 | Product Detail | Core | Inspect media and specifications, choose a purchasable option, and add it to cart. |
| 71 | Product Comparison | Core | Compare selected products by decision-relevant specifications and price. |
| 72 | Shopping Cart | Core | Review items, change quantity, remove items, and inspect current totals. |
| 73 | Checkout Address | Core | Enter or select shipping and billing details, including validation and regional formats. |
| 74 | Delivery Options | Core | Choose a viable shipping or pickup option with cost and delivery estimates. |
| 75 | Checkout Review | Core | Review items, addresses, fees, and payment-method summary before placing an order. |
| 76 | Order Confirmation | Core | Confirm the actual order outcome and provide receipt, delivery, and support links. |
| 77 | Order Tracking | Core | Follow fulfilment milestones, delivery exceptions, and tracking information. |
| 78 | Reviews & Ratings | Core | Inspect rating distribution, filter reviews, and submit feedback when permitted. |

### Finance & billing

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 79 | Quick Send | Core · public | Select a beneficiary to start a transfer; existing QuickSendBlock does not itself collect or send money. |
| 80 | Recent Transactions | Core · public | Inspect recent incoming/outgoing transactions and open details. |
| 81 | Account Balance | Core | View available, pending, and total balances with currency and update time. |
| 82 | Transfer Review | Core | Review recipient, amount, fee, rate, and arrival estimate before explicit confirmation. |
| 83 | Invoice Detail | Core | Inspect invoice lines, taxes, adjustments, amount due, status, and payment actions. |
| 84 | Subscription Billing | Core | Manage the current plan, usage, renewal date, and upgrade or cancellation flow. |
| 85 | Payment Methods | Extension | View, add, set default, and remove tokenised payment methods via a provider adapter. |
| 86 | Expense Review | Extension | Review submitted expenses, attached evidence, categories, and reimbursement decisions. |

### Support & feedback

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 87 | Help Centre Search | Core | Search troubleshooting content and escalate when no useful answer is found. |
| 88 | Support Request | Core | Describe a problem, attach relevant evidence, and receive a trackable reference. |
| 89 | Support Conversation | Core | Follow a case, reply, share attachments, and understand ownership and status. |
| 90 | Feedback Collection | Core | Give a rating and optional explanation, with explicit submission feedback. |
| 91 | Feature Request Board | Core | Find existing requests, vote, submit an idea, and track a published status. |
| 92 | Incident Status | Core | Inspect affected services, a chronological incident narrative, and subscription options. |

### System states & utilities

| # | Block | Tier | Distinct task and interaction |
|---|---|---|---|
| 93 | Empty State | Core · public | Explain an absence of content and offer an appropriate next action; existing EmptyStateBlock. |
| 94 | Error Recovery | Core | Explain a recoverable failure, preserve user input, and offer retry or a safe alternative. |
| 95 | Access Request | Core | Explain restricted access and offer a request, sign-in, or administrator contact path. |
| 96 | Upload Manager | Core | Add multiple files, inspect per-file progress, cancel, and retry failed uploads. |
| 97 | Background Job Centre | Core | Follow multiple asynchronous jobs, inspect results, and retry eligible failures. |
| 98 | Search Results | Core | Inspect grouped site/application results, refine the query, and navigate to a match. |
| 99 | Maintenance & Offline | Extension | Explain service unavailability, show a truthful update, and preserve a route back. |
| 100 | Consent Preferences | Extension | Review optional categories, set preferences, and revisit or withdraw previous choices. |

## Discovery and categorisation

Use a searchable catalog with a category rail on wide screens and a labelled category selector on narrow screens. Give previews the room their content requires: wide table and shell examples; smaller forms and empty states. Each detail page should lead with the live example, purpose, state controls, and supported interactions, followed by usage and data contracts. Avoid forcing every preview into the same small tile.

Suggested filters:

- Domain: application, marketing, commerce, finance; multi-value, independent of primary category.
- Task: navigate, authenticate, discover, compare, create, review, manage, recover.
- Composition: section, panel, form, collection, shell. These describe embedding context.
- Status: planned, internal, experimental, stable, deprecated. Only released supported entries contribute to the public count.
- Capabilities: light/dark, scoped themes, mobile verified, keyboard verified, controlled data, optional chart dependency.

Do not advertise an “accessible” or “responsive” badge based on the presence of ARIA or breakpoint classes. Record the verified widths, scenarios, tool versions, date, and remaining limitations. A block may belong to several domain filters while counting once in its primary category.

Proposed catalog metadata: stable ID; display name; public export and entry point; primary category; domain and task tags; status; supported flavor/version; dependencies; preview stories; documented states; source/docs links; last verification; known limitations. Keep the authored catalog authoritative and derive documentation navigation and AI discovery from it. Extend the existing catalog/recipe/distribution system rather than creating an unrelated registry.

## Shared behavior and quality requirements

Every new block must define default, empty, loading, error, success, disabled/read-only, and permission states where those states make sense. Do not manufacture a success message before the consumer confirms success. Distinguish an empty source from a search returning no matches. Loading and errors retain useful context and recovery actions.

Use native links for destinations, buttons for actions, labelled forms, meaningful headings, and native table structures. Offer a heading-level or heading-slot contract where embedding context varies. Lists should expose list semantics; static notification lists should not claim the richer feed interaction model unless implemented. Provide keyboard focus visibility and focus restoration when a panel or menu closes.

Data and persistence belong to the consuming application. Document controlled and uncontrolled behavior, selection scope across pages, pending mutations, pagination ownership, and cancellation. Hide or explicitly disable unavailable actions. Commerce and finance blocks integrate provider callbacks; they must not pretend to perform a payment, authenticate a user, or provision an account.

Exercise 0, 1, typical, and large data sets. Include long names, translated labels, large currency amounts, missing images, delayed responses, and an unavailable backend. Treat dates, currencies, time zones, pluralisation, and locale text as configurable inputs. Start with realistic typical content, then add deliberate edge cases.

Release gates:

1. Visual review: representative content, meaningful hierarchy, no clipping or overlap in either supported mode.
2. Responsive review: 320, 390, 768, and 1440 CSS-pixel viewports, plus a narrow parent container on desktop and 200% text sizing. Essential actions remain reachable. Tables can have an intentionally bounded scroll area.
3. Semantics and keyboard: meaningful names, native roles, truthful selection/state, valid ARIA references, complete keyboard flows, and focus review.
4. Contrast and targets: applicable WCAG AA text/UI contrast; examine target size and spacing. Prefer generous touch areas without treating every sub-44px control as an automatic AA failure.
5. Theming: light, dark, custom brand/surface overrides, and scoped light/dark contexts. Semantic surface, text, border, action, feedback, spacing, shape, and type roles should control intended customisation. Exempt authentic brand artwork only where deliberate.
6. Interaction checks: real search/sort/selection/submission/recovery tests, not just a render smoke test. Include row replacement and filtering for collection blocks.
7. Distribution: verified public import, copyable example, documented callbacks, accurate catalog/AI metadata, and explicit optional dependencies.

The current audit is the baseline for these gates, not a claim that existing blocks already pass them. Visual variants remain variants and reuse the same behavior contract. Preserve the flavor/mode/customisation distinction documented in the flavor contract.

## Delivery order

| Stage | Catalog target | Purpose |
|---|---:|---|
| Foundation repair | 8 | Repair and verify 7 public blocks; finish Header and promote it only when ready. |
| First expansion | 32 | Add 24 core blocks in small, reviewable domain batches. |
| Core breadth | 56 | Add 24 more; validate compositions across dashboard, landing, shop, and finance use cases. |
| Core completion | 80 | Finish the remaining 24 core ideas, their states, docs, and discovery metadata. |
| Extensions | 100 | Add the 20 extension ideas when foundations and maintenance capacity support them. |

Recommended first twelve new blocks: Application Shell, Page Header & Actions, Site Footer, Create Account, Profile Settings, KPI Overview, Task List, Product Hero, Pricing Plans, Product Collection, Shopping Cart, and Invoice Detail. This tests the shared quality contract across all four requested domains early. Complete Header separately as existing unfinished work.

Use 4–6 blocks per implementation batch, with one working composition to expose inconsistent spacing, headings, themes, and nested scrolling. The numbers above describe capability targets, not deadlines. Batch ordering beyond the first twelve remains open to demand and prerequisite work.

## Implementation references and open questions

Use the project's [design context](../.impeccable.md), [flavor contract](flavor-contract.md), [vision](vision-and-roadmap.md), and current block audit as the governing references. For implementation skill references, responsive-design and spatial-design are most useful for embedded layouts; interaction-design for forms, tables, and menus; color-and-contrast for theme roles; and motion-design for optional feedback that respects reduced motion.

The category balance is confirmed. For the next discussion: which of the first twelve would make the most useful initial batch? Packaging and licensing for any future expanded collection remain separate, unresolved product decisions; this proposal does not change them.
