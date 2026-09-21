# Foundation and connected pilots

Date: 21 September 2026. Status: local implementation, not published.
Reference versions: UI 0.9.7, AI 0.1.4, Citrionus. These versions identify the working-tree reference; they do not claim that npm already contains these changes.

## Delivered

| Stream | Result |
| --- | --- |
| Foundation | Source-derived public prop contracts, complete component-family registration, exact-name-first aliases, structured usage validation, token-reference reconciliation, and repeatable generation checks. |
| AI and MCP | Shared Citrionus catalog and prompts, explicit version assumptions and capability limits, seven tools preserving the original four names, and real stdio protocol tests. |
| Motion | Optional `@raydenui/ui/motion` entry point, four presets, provider and hooks, Pressable/Reveal/Collapse/SharedLayout primitives, and opt-in Tabs/Modal motion. |
| Distribution | Five schema-checked package-backed registry items, versioned local endpoints, source blocks with shared catalog metadata, and real CLI install/build verification. |
| Connected guidance | Component prompt chooser, guidance on Button/Tabs/Modal pages, registry command/namespace chooser, motion documentation and playground, generated `llms.txt` and `llms-full.txt`. |

Citrionus remains the free default. Motion uses shared behavior and does not introduce a visual flavor runtime. Existing components retain motion disabled by default where an opt-in prop was added; system reduced-motion preferences take precedence over preset choices.

## Maintenance

After changing component contracts, regenerate AI manifests and catalog, then registry and guidance outputs. Review authored examples separately:

```sh
pnpm --filter @raydenui/ai generate-manifests
pnpm --filter @raydenui/ai generate-catalog
pnpm registry:build
pnpm guidance:build
pnpm build
pnpm check:pilots
```

`check:pilots` checks the generated contracts/catalog, builds and tests AI/MCP, validates manifests and token references, and checks registry/guidance freshness. Component-quality CI also installs registry items into a fresh application and exercises the connected docs in Chromium. The existing npm release workflow publishes the UI package only and now gates it on the matching AI checks; it does not publish the AI package automatically.

## Verification evidence

- Full component suite: 45 files, 303 tests passed, including the motion pilot's interaction coverage.
- UI build, TypeScript checks, existing bundle budgets, and documentation contract checks passed. Lint has zero errors and 28 warnings across existing UI code and AI tooling.
- Production documentation generated 54 static pages. Desktop and mobile browser checks passed for copied prompts, actual Chart imports, registry configuration, keyboard tabs, modal focus restoration, OS reduced-motion emulation, and clipboard-denied fallback.
- Real registry installation uses the official pinned CLI, a fresh application, and the locally packed UI. The fixture's TypeScript and Vite build pass.
- All six AI tests passed. Package checks cover generated contracts, all 36 registered families and 69 component exports, zero unresolved anatomy token references, built package assets, and a real MCP client/server session. Motion APIs are recorded separately from the family count.

## Remaining release criteria

- **Visual/token parity:** runtime CSS, the UI preset, AI token values, and Figma anatomy are separately maintained. Known unresolved token references were reconciled, but full visual and dark-mode parity is not certified.
- **Representative agent outcomes:** structured validation and real registry examples work; the backlog's full form/dashboard/marketing generation evaluation and every authored recipe interaction still need an explicit acceptance run.
- **Project detection:** clients receive reference versions and limitations. Automatic inspection of the consuming project's installed packages is not implemented.
- **Motion scope:** SharedLayout animates a persistent node. Cross-tree shared-element transitions, spring physics, and animated modal backdrops are outside this pilot.
- **Distribution scope:** registry items install editable composition code backed by the UI package. They do not distribute every primitive's source. Local smoke tests substitute a freshly packed UI tarball for the same-version unpublished runtime; a public release needs a new package version and regenerated registry metadata.
- **Future flavors:** switching, a second visual identity, compatibility migrations, and paid offerings remain roadmap work.

The foundation backlog remains the acceptance checklist. Passing the pilot gates does not mark FND-05, FND-07, and FND-09's broader parity, example, and release acceptance requirements complete.
