# Showcase release — 24 September 2026

Implemented the approved brief at `/explore`, with six block pages and eight component pages. All live examples use published `@raydenui/ui@0.10.1`. Blocks are marked experimental. Copyable source is generated from the actual preview fixtures.

Verified:
- TypeScript and production preview build.
- All 15 public pages: canonical metadata, structured data, local links, screenshot assets, exact copied source, sitemap and AI discovery index.
- All 14 previews: light/dark themes, advertised states, reset, source view, clipboard copying and mobile overflow checks in Chrome.
- Gallery filtering, search, empty results, shareable filter URLs, desktop and mobile images.
- Component actions, controlled input/select, calendar clearing, tabs, menu actions, modal Escape and confirmation, and table sorting.
- Block navigation including mobile menu, profile save/cancel, table search and row selection, demo sign-in, billing period and plan selection, cart quantity/total recalculation, removal and empty-cart recovery.
- Homepage navigation at 1440, 1082, 768 and 390 pixels.

The gallery is static and loads no React bundle. Detail frames load their selected example from a separate build. Those frames are noindex; descriptions and complete source on detail pages remain available without JavaScript. Screenshot captures use the actual package, including separate mobile renders.

Preview data and submission feedback are local demonstrations. These checks do not certify every library component or every assistive technology. The published icon registry is a shared dependency of the preview build; the gallery does not load it.

Production deployment: `dpl_4Mte69NjhTUR2B8hMFBV87t6ZF8j`, aliased to https://www.rayden-ui.dev. Verified all 18 public HTML pages byte-for-byte against the local output, all 28 gallery images, discovery files, preview noindex headers and unknown-route 404 behavior. Real example interactions and the gallery-to-detail mobile navigation passed on production. IndexNow acknowledged 18 URLs; this is not confirmation of indexing.

## Expansion — 16 more examples

The catalog now contains 30 examples: 14 blocks and 16 components. Added Create account, Task list, KPI overview, Workspace switcher, Command palette, Product collection, Notifications and Empty state; Accordion, Checkbox, Radio, Toggle, Slider, Progress bar, Tooltip and Alert. New entries lead their catalog views, and related examples now prioritise the same category.

All new previews compile against the same pinned published release. Verified their interactive workflows, light/dark rendering, advertised states, reset, exact source copying and mobile overflow. Added real desktop/mobile captures for every entry, verified documentation destinations and generated crawlable pages, sitemap entries and the AI discovery index. No new tracking or remote form submission was introduced.

Expansion deployed as `dpl_7PJThVUVSYkW77Nr7L4A4hdUFKXX` to https://www.rayden-ui.dev. Production verification passed for all 34 public HTML pages, all 60 gallery images, discovery files, preview noindex headers and unknown-route 404 behavior. All 16 new interaction workflows also passed on production. IndexNow acknowledged 31 showcase URLs.

## Expansion to 50 examples

Added eight blocks: Product hero, Feature overview, Site footer, Site header, Page header, Product detail, Checkout review and Recent transactions. Added twelve components: Avatar, Badge, Banner, Breadcrumb, Button group, Card, Chip, Counter, File upload, Pagination, Progress circle and Stepper. The gallery now contains 22 blocks and 28 components, with the newest entries first in each type.

The marketing additions demonstrate actionable hero and feature sections plus a grouped footer. Commerce examples show local option selection, quantity calculations, editable checkout choices and explicitly labelled demo confirmations. File selection validates type, size and count locally without uploading file contents. All entries retain the pinned published release, exact source copying, responsive captures and crawlable descriptions.

Validation passed for all 20 new interactive workflows, all advertised states, theme and viewport controls, exact copied source, and mobile overflow. The Stepper example switches to a vertical layout below 560px; file validation uses the library’s own error presentation. All documentation URLs returned 200, and the public static checks passed for 51 showcase pages.

The 50-example release is deployed as `dpl_EXVZS7FmJL1CCt2DxHuitngEbg9d` at https://www.rayden-ui.dev. All 54 public HTML pages matched the local output, all 100 gallery images returned 200, and discovery files, preview noindex headers and unknown-route 404 behavior passed. All 20 new workflows passed on production. IndexNow acknowledged 51 showcase URLs; acknowledgement is not confirmation of indexing.
