# Additional block discovery — 22 September 2026

Source-inventory scan against the confirmed [100-block plan](blocks-expansion-plan.md). This is discovery, not a fresh visual, accessibility, or release audit. The workspace contains ongoing edits; statuses describe the source snapshot inspected during this scan.

## What is already implemented

The `src/blocks` directory now contains **16 standalone `*Block.tsx` implementations**. The public [blocks entry](../src/blocks/index.ts) still exports **7**. The remaining **9** consist of the existing internal Header plus **8 additional implementations**.

| Additional block | Plan idea | Category | Source | Public entry status |
|---|---:|---|---|---|
| Create Account | 10 | Authentication & onboarding | [CreateAccountBlock](../src/blocks/CreateAccountBlock.tsx) | Not exported |
| KPI Overview | 17 | Dashboards & analytics | [KpiOverviewBlock](../src/blocks/KpiOverviewBlock.tsx) | Not exported |
| Profile Settings | 33 | Forms & settings | [ProfileSettingsBlock](../src/blocks/ProfileSettingsBlock.tsx) | Not exported |
| Task List | 45 | Collaboration & workflow | [TaskListBlock](../src/blocks/TaskListBlock.tsx) | Not exported |
| Product Hero | 49 | Marketing & conversion | [ProductHeroBlock](../src/blocks/ProductHeroBlock.tsx) | Not exported |
| Feature Overview | 50 | Marketing & conversion | [FeatureOverviewBlock](../src/blocks/FeatureOverviewBlock.tsx) | Not exported |
| Pricing Plans | 55 | Marketing & conversion | [PricingPlansBlock](../src/blocks/PricingPlansBlock.tsx) | Not exported |
| Site Footer | 05 | Navigation & shells | [SiteFooterBlock](../src/blocks/SiteFooterBlock.tsx) | Not exported |

Each has a corresponding story file. There are also two composition fixtures: [Application Surface](../src/blocks/ApplicationSurface.stories.tsx), which combines KPI Overview, Profile Settings, and Task List, and [Marketing Landing Composition](../src/blocks/MarketingLandingComposition.stories.tsx). These compositions exercise several blocks together; they do not add two more blocks to the count.

The [Batch A report](blocks-batch-a.md) describes verification of the four marketing/navigation additions and explicitly lists distribution as unfinished. Its test results are reported by that document, not rerun by this discovery scan. Presence of implementation and stories is not equivalent to release readiness. Before exporting KPI Overview, review its direct chart import against the library's optional-chart dependency boundary.

## Eleven more planned blocks have useful starting material

These are extraction candidates, not eleven finished blocks. Vite/Next.js and JavaScript/TypeScript copies of the same starter pattern count once. Representative TypeScript Vite sources are linked below.

| Planned block | Plan idea | Starting material | Work needed to become reusable |
|---|---:|---|---|
| Application Shell | 02 | [DashboardLayout](../packages/create-rayden-app/templates/vite/dashboard/typescript/src/components/DashboardLayout.tsx), its Sidebar, and `sidebar-layout` recipe | Replace router-specific Outlet with composition slots; define destinations, collapse state, and mobile navigation. |
| Page Header & Actions | 03 | `dashboard-header` recipe | Update the recipe to current component APIs; accept breadcrumbs, title, status, and configured actions as props. |
| Customer Proof | 53 | [Testimonials](../packages/create-rayden-app/templates/vite/landing/typescript/src/components/Testimonials.tsx) and `testimonial-cards` recipe | Accept attributed customer data, use quotation semantics, and support theme roles. Keep fictional fixture claims clearly illustrative. |
| Plan Comparison | 56 | `pricing-comparison` recipe | Data-driven columns, readable included/excluded labels, mobile presentation, and actual action contracts. |
| Product Collection | 69 | [Products](../packages/create-rayden-app/templates/vite/ecommerce/typescript/src/pages/Products.tsx) and ProductCard | Replace static imports with data/callback props; make category filters keyboard-operable controls; define sorting and empty states. |
| Product Detail | 70 | [ProductDetail](../packages/create-rayden-app/templates/vite/ecommerce/typescript/src/pages/ProductDetail.tsx) | Separate routing and cart persistence; expose product, quantity, availability, and add-to-cart callbacks. Remove or wire the inert wishlist control. |
| Shopping Cart | 72 | [Cart](../packages/create-rayden-app/templates/vite/ecommerce/typescript/src/pages/Cart.tsx) and CartItem | Controlled items, quantities, totals, and actions; configurable currency/shipping; loading, empty, and update-error states. |
| Checkout Address | 73 | Shipping/contact sections of [Checkout](../packages/create-rayden-app/templates/vite/ecommerce/typescript/src/pages/Checkout.tsx) | Persistent labels, field values/errors, region-aware fields, and saved-address selection; remove assumptions about US states and ZIP codes. |
| Checkout Review | 75 | Order summary in [Checkout](../packages/create-rayden-app/templates/vite/ecommerce/typescript/src/pages/Checkout.tsx) and Cart | Explicit totals and fees, edit links, pending state, and a consumer-confirmed order result. The current checkout simulates success with a timeout and alert. |
| Article Index | 61 | [Blog Home](../packages/create-rayden-app/templates/vite/blog/typescript/src/pages/Home.tsx) and PostCard | Accept article data, selected topics, search/pagination ownership, and empty/loading states. |
| Article Reader | 62 | [Post](../packages/create-rayden-app/templates/vite/blog/typescript/src/pages/Post.tsx) | Structured article content and proper list/heading markup; remove route/data coupling and wire share/related-reading actions. |

The recipe references above live in [recipes.json](../packages/rayden-ai/src/recipes/recipes.json). That file contains **15 recipes**, several of which overlap existing blocks. Treat them as design and composition references: the snippets are not independently verified production implementations.

## Avoid duplicate work

- `hero-centered` and `hero-split` map to Product Hero variants.
- `pricing-three-tier` maps to Pricing Plans; the comparison matrix remains a distinct task.
- `feature-grid`, `stats-cards`, `signup-form`, `login-form`, and `empty-state` overlap blocks already present.
- `data-table-page` overlaps Searchable Table; a page wrapper is not a new block.
- `settings-form` should be reconciled with Profile Settings and the planned settings family.
- `cta-banner` is useful composition material, but it is not explicitly a separate slot in the approved 100. Keep it as a Hero/announcement variant or discuss a substitution before changing the agreed count.

## Discovery gaps to address

The existing recipe API still exposes only `marketing`, `dashboard`, `forms`, and `content` categories in [recipes/index.ts](../packages/rayden-ai/src/recipes/index.ts). That is a different taxonomy from the approved 12-category block catalog. Add an explicit mapping or a versioned catalog contract; simply labelling new source files is insufficient to make them discoverable.

The plan's baseline and “existing implementations” column still describe the original seven public blocks plus Header. Preserve that as a dated baseline or add a separately maintained current-status inventory. Do not silently relabel unexported implementations as shipped blocks.

The commerce starters contain actual filter/sort/cart composition, but they also embed routing, demo data, hard-coded surfaces, nested link/button markup, and a simulated checkout. Reuse their task structure while implementing the block quality contract; copying them wholesale would preserve the earlier audit's problems.

## Recommended next steps

1. Complete the review, public exports, documentation, and catalog wiring for the eight new implementations already present. Keep Header's separate readiness gate.
2. Build the next extraction batch around **Product Collection, Product Detail, Shopping Cart, and Checkout Review**. They share data shapes and provide a useful commerce composition.
3. Follow with **Application Shell, Page Header & Actions, Customer Proof, and Plan Comparison** to expand reusable navigation and complete the marketing journey.
4. Use **Article Index and Article Reader** to establish the content category; retain Checkout Address as a separate form contract rather than burying it inside checkout.

This scan adds implementation leads without changing the approved 12 categories or 100-block target. It changes no production source. Graph tools were unavailable; evidence came from the public export file, the bounded block directory, representative template source, and all recipe IDs, with selected recipe code inspected. No claim is made that all patterns elsewhere in the repository have been exhaustively reviewed.
