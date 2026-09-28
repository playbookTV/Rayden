# Rayden component and block showcase — implementation brief

Date: 24 September 2026
Status: Approved by the user and implemented. Browser verification and production deployment recorded in the showcase release notes.

## 1. Purpose and audience

Help product teams evaluating Rayden see what they can build, try representative interactions, and obtain a usable example. Support both developers looking for an exact component and designers browsing complete product patterns.

Primary journey: find a useful pattern → inspect the real preview → try its states → copy usage or follow the documentation. Measure preview engagement and progression into usage/docs if analytics is subsequently authorised; do not add tracking as part of this brief.

## 2. Primary action

Open a preview that matches the visitor’s task and take its working usage example into a project. Lead the default view with complete blocks, which communicate the library’s usefulness at a glance. Components remain directly accessible through a prominent type switch and navigation links.

## 3. Design direction

Carry forward the approved graphite-and-copper website, Manrope/Hanken Grotesk typography, restrained borders, and generous preview space. The examples should provide the visual interest. Use larger frames for complete blocks and compact, aligned frames for individual components; keep names and actions in consistent positions.

The site shell stays graphite. A preview’s light/dark switch changes the actual rendered library theme, independently of the surrounding site. Keep demos readable at their intended scale; do not shrink desktop interfaces into illegible thumbnails. UIAble’s separate component/block browsing is a useful reference, expressed with Rayden’s own visual identity.

## 4. Layout and routes

- `/explore`: compact heading, searchable catalog, Blocks / Components switch, category filters, and previews visible in the first viewport. Navigation links can select the appropriate type using a URL parameter.
- Desktop: narrow category navigation alongside a spacious preview area. Use a small, curated opening selection followed by consistent browse rows. Two columns for substantial block previews; additional columns only for genuinely small examples.
- Mobile: search and type switch first, categories in an accessible filter control, one preview per row. Large blocks open in a dedicated preview page with a real mobile viewport option.
- `/blocks/<slug>` and `/components/<slug>`: addressable detail pages with name, short purpose, release/status information, large preview, Preview / Code switch, relevant variants, supported states, reset, install/import guidance, and documentation links.
- Detail pages explain use cases and demonstrate behaviour. Detailed API tables remain in the docs; avoid maintaining a second copy.
- Preserve selection, search, and scroll when returning from a detail page. Browser back and shareable links should behave predictably.

## 5. Interaction and important states

Catalog tiles provide a stable preview and an explicit “Open preview” link. Interactive controls inside a live demo must not also navigate the surrounding tile. Avoid making the whole tile a button around other buttons.

Load interactive previews on demand rather than mounting the whole catalog. Each preview gets a reset action. Support keyboard operation, visible focus, reduced motion, and honest feedback from demo actions.

Controls on detail pages: only the variants and states that the example genuinely supports. A table may offer populated/loading/empty/error views; a button may offer supported variants, sizes, and disabled state. Responsive block previews change the available viewport instead of scaling a screenshot.

Loading: reserve the preview’s dimensions. Failed preview: retain the description/code and offer retry. No search results: show the query, a clear-filter action, and nearby categories. Copy success: brief accessible confirmation. Demo state must not submit real payments, authenticate users, or claim saved data without a real service.

## 6. Content and initial selection

Proposed opening block selection: Application Shell, Profile Settings, Searchable Table, Login, Pricing Plans, and Shopping Cart. Confirm each against the selected published release before inclusion. Candidates are based on the local documentation inventory, not an assertion that every current source change is released or fully verified.

Proposed component selection: Button, Input, Select, Date Picker, Tabs, Dropdown Menu, Modal, and Table. Include useful states and two or three representative variations, rather than padding the gallery with dozens of tiny variants.

Every entry requires: real export name, plain-language display name, category/use-case tags, concise description, documented import path, pinned package version, release status, preview fixture, copyable usage, relevant docs URL, and known limitations.

The current block documentation labels blocks experimental. Preserve accurate status visibly; do not infer “stable”, accessibility certification, or availability from the existence of a story or source file. Do not use unverified catalog totals as headline marketing claims.

## 7. Distinctive feature: show how a block is assembled

On a block detail page, include a compact “Built with” list linking to the actual components used in that example. This connects finished patterns to their building pieces and makes the catalog easier to understand.

“Copy for AI” can package the verified imports, versions, intended behaviour, and relevant Rayden AI guidance into a prompt. Only include AI capabilities and block contracts supported by the matching published reference. This action comes after the preview and working code, not ahead of them.

## 8. Implementation and discoverability

Keep the existing marketing site and deploy through its current Vercel project. Add an isolated React preview build using pinned published Rayden packages. Where necessary, frame previews to prevent marketing styles and component themes from affecting each other. Reuse maintained story/example data after checking it; do not embed the entire Storybook interface or imitate components in marketing HTML.

Use one catalog manifest for browsing, routes, metadata, documentation links, version labels, and sitemap entries. Keep demo source and the displayed usage tied together. Static or prerendered page descriptions must remain available before preview JavaScript loads.

Give useful detail pages distinct titles, canonical URLs, explanatory content, related links, and sitemap entries. Search/filter combinations should not generate an unlimited set of indexable pages. A detail page should offer substance beyond a title and iframe.

Relevant implementation references: impeccable’s spatial-design, interaction-design, responsive-design, and color-and-contrast guidance; the existing `.impeccable.md`; Rayden’s maintained component/block docs and published catalog. Reference website: https://uiable.com/.

## 9. Scope and decisions for review

Recommended first release: one browse page, the curated block/component selection above, working detail previews, code copying, light/dark and applicable state controls, documentation links, and complete keyboard/mobile behaviour. Expand after proving the preview architecture with one complex block and one interactive component.

Exclude accounts, favourites, a full code editor, arbitrary prop builders, and template authoring from the initial scope.

Proposed decisions for review: blocks-first default; preview-led detail pages; a curated first release expanded from verified examples. Before implementation, verify the latest published package contents and each selected block’s status. The design does not assume that the current working tree equals the npm release.
