# Blocks export and commerce batch — 22 September 2026

## Delivered

- Exported all 16 existing block implementations and their public types from `@raydenui/ui/blocks`.
- Added ProductCollectionBlock, ProductDetailBlock, ShoppingCartBlock, and CheckoutReviewBlock. The public library now contains 20 block components.
- Preserved the approved 12-category, 100-block expansion plan. Four commerce patterns are implemented in this batch; this is not a claim that the full target library is complete.
- Corrected HeaderBlock’s controlled switcher contract and introduced defaultActiveIndex for uncontrolled use.
- Replaced KPI’s eager chart import with a theme-aware SVG sparkline and an accessible data table, keeping optional chart peers optional.
- Added 17 commerce stories including a connected demo shop, a gallery, dark and custom themes, a narrow container, error/empty/loading/pending states, unavailable stock, JPY formatting, compact collection, product gallery, cart drawer, and interactive design review.
- Added documentation for the nine newly public application/marketing blocks and the four commerce blocks, and expanded the docs index.
- Strengthened packed-consumer checks for all 20 exports in both ESM and CommonJS, optional chart dependency isolation, and server rendering of KPI and commerce blocks.

## Review links

With Storybook running on port 6006:

- [Design review: layouts, themes, widths, and states](http://localhost:6006/?path=/story/blocks-commerce--design-review)
- [Cart drawer composition](http://localhost:6006/?path=/story/blocks-commerce--cart-drawer)
- [All four new blocks](http://localhost:6006/?path=/story/blocks-commerce--all-new-blocks)
- [Interactive shop](http://localhost:6006/?path=/story/blocks-commerce--full-journey)
- [Dark gallery](http://localhost:6006/?path=/story/blocks-commerce--dark-gallery)
- [Custom sage theme](http://localhost:6006/?path=/story/blocks-commerce--custom-theme)

The shop uses original, self-contained vector illustrations. It explicitly identifies its sample address, payment method, and simulated order confirmation. No payment or order is sent.

## Design refinement

The four commerce blocks establish the visual benchmark for subsequent batches. Product imagery leads the collection and detail view; typography and spacing establish priority; secondary actions stay quiet; cart and checkout use the same summary treatment. Existing public props remain compatible.

- Collection: portrait image grid, two columns in narrow containers, semantic product headings, and an optional compact list.
- Product detail: selectable image thumbnails, clearer price/stock grouping, native finish controls, integrated quantity control, and optional stacked composition.
- Cart: more legible item rows, restrained remove actions, stronger totals, and optional stacked layout. The drawer example composes the existing Modal with this layout.
- Checkout: fewer nested boxes, flat delivery/payment sections, product thumbnails, and a clearly dominant confirmation action.
- Review: one interactive screen compares all four blocks, light/dark appearance, available/phone width, alternate layouts, and ready/empty/pending/error states.

These are useful variants of four blocks, not additional block counts. The library remains at 20 public blocks against the approved 100-block plan. Layout changes remain container-based, colors use the existing theme tokens, and motion respects reduced-motion preferences.

## Verification

- Package build: passed.
- TypeScript: passed.
- Scoped ESLint: passed.
- Documentation prop contracts: passed, no findings.
- Full block-story run: 19 files, 155 stories passed.
- Follow-up header regression and commerce accessibility run: 2 files, 27 stories passed. Commerce sets accessibility violations to fail tests.
- Final commerce refinement regression: all 17 stories passed with accessibility violations configured to fail; type, lint, documentation, build, and packed-consumer checks passed.
- Native keyboard check: Escape closes the cart drawer and restores focus to its opening button.
- Packed consumer: passed with React/React DOM and no optional chart peers; all 20 ESM and CommonJS exports and selected server renders checked.
- Live gallery: all four sections fit their containers at viewport widths 320, 390, 768, and 1440 in light and dark mode, with no document horizontal overflow. Narrow layouts, product illustrations, cart totals, delivery details, and theme colors visually inspected.

These checks cover the implemented examples in desktop Chromium and the Codex preview. They do not establish full WCAG conformance or physical-device/cross-browser certification. The host application remains responsible for server-side price, stock, address, tax, and payment validation.

## Export artifact

`exports/raydenui-ui-0.9.7.tgz` is a local installable package containing the complete built library and all 20 block exports. It has not been published to npm.

## Public contracts

- Prices and totals use integer minor currency units; all items share the block’s currency and locale.
- Product option IDs and cart-line IDs must be stable and unique. Cart quantities are controlled by the host application.
- Pending and success states are supplied by the host. Checkout never fabricates a successful transaction.
- Shipping, tax, and discounts are supplied amounts, not built-in commerce rules. The sample shop’s delivery rule is fixture-only.
- Collection search/filter/sort and product-detail selection are local UI state. Product changes reset selection; stock changes constrain quantities.
- Layouts use container queries. Native, labelled controls, chosen heading levels, live feedback, and semantic lists/definitions support keyboard and assistive-technology use.
