# Citrionus foundation backlog

Status: Implementation underway. The original acceptance criteria below remain the release checklist; see the [21 September pilot report](./implementation-pilots-2026-09-21.md) for delivered work and remaining gaps.
Date: 20 September 2026.
Roadmap scope: Stage 2, with later-stage dependencies explicitly separated.
Related: [Product brief](./citrionus-product-brief.md), [Flavor contract](./flavor-contract.md).

## Outcome

Make Citrionus a dependable free default: agents and developers receive correct component information, examples match real APIs, and release checks prevent that information from drifting.

Priorities below describe implementation order. They are not estimates or release dates.

## Verified starting point

The local review on 20 September 2026 established:

- MCP starts and exposes four tools. Component discovery reports 36 catalog entries; 36 manifest files exist, but only 26 are registered for lookup.
- The ten unregistered manifests are Accordion, ActivityFeed, Banner, Chart, Counter, DatePicker, Modal, Slider, Spinner, and Stepper.
- Lookup rejects existing Card, Modal, Accordion, DatePicker, and Stepper components because of stale exclusion rules. Spinner resolves to ProgressCircle.
- The validation helper accepts an invented component as valid and does not reject an invalid Button size.
- All 15 layout recipes are returned by MCP. Recipe delivery itself is not a demonstrated failure.
- Figma anatomy data exists for 36 registry entries, but the four MCP tools do not expose anatomy or variant helpers.
- Documentation references nonexistent helper exports. Manifest generation and validation commands reference missing scripts. The server reports version 0.1.1 while the AI package is 0.1.4.
- Type checking and bundling passed. Token generation succeeded through an alternative Node invocation after the standard runner encountered a local sandbox restriction. That restriction is not evidence of a product build defect.

These are a dated local baseline, not claims about the published npm package or every API. Recheck affected files before implementation because other UI work is in progress.

## Ordered work

### FND-01 — Establish the canonical component catalog

Priority: First. Dependencies: none.

Reconcile the [UI exports](../src/index.ts), [catalog](../packages/rayden-ai/src/manifests/components.json), and [manifest registry](../packages/rayden-ai/src/manifests/index.ts). Identify component families, real exports, and subcomponents before treating every display name as an import.

Acceptance criteria:

- Every advertised entry maps to its actual public import or is clearly identified as a family with named exports.
- Every supported directly importable component has retrievable usage information; compound components identify their required parts.
- Existing manifest files are registered or explicitly classified with a documented reason for exclusion.
- Coverage checks identify missing, duplicate, orphaned, and contradictory entries using the UI's actual public surface rather than a hard-coded count of 36.
- Catalog naming preserves existing consumer imports; any newly discovered API discrepancy is documented before changing the runtime API.

### FND-02 — Correct existence rules and alias resolution

Priority: First. Dependencies: FND-01.

Replace contradictions between the catalog and [alias rules](../packages/rayden-ai/src/rules/aliases.json). Make exact supported names take precedence over aliases and scope alternatives to the selected capabilities.

Acceptance criteria:

- Card, Modal, Accordion, DatePicker, Slider, and Stepper return their supported information.
- Spinner returns Spinner information, not ProgressCircle.
- Every exact supported name succeeds regardless of old exclusion-list entries.
- Unknown names and ambiguous aliases return actionable results without fabricating component availability.
- A regression check covers the full catalog and the demonstrated alias/exclusion failures.

### FND-03 — Define and implement meaningful usage validation

Priority: Next. Dependencies: FND-01 and FND-02.

Improve the [validation helper](../packages/rayden-ai/src/rules/index.ts) according to the flavor contract. Clearly delimit what can be checked from a structured usage description.

Acceptance criteria:

- An invented component fails validation.
- An invalid enum value such as Button size `giant` fails; supported values pass.
- Required props and applicable composition rules are checked against actual component contracts.
- Legitimate inherited HTML, ARIA, and data attributes remain supported.
- Unknown or unsupported props are distinguished from deprecated aliases and advisory guidance.
- Dynamic or otherwise unassessable values are reported as not assessed rather than silently passed.
- Tests include valid usage, invalid usage, optional children, aliases, and representative compound components.

This item does not require a general-purpose React code parser. A later workflow may add source-code analysis using this validated contract.

### FND-04 — Make MCP requests and errors dependable

Priority: Next. Dependencies: FND-01 and FND-02.

Harden the [server](../packages/rayden-ai/src/mcp/server.ts) and its four tool handlers. Preserve their established names and successful behaviors.

Acceptance criteria:

- Missing required inputs, wrong types, invalid categories, unknown tools, and unavailable components receive well-formed errors at the appropriate protocol or tool-result level.
- Tool execution errors are distinguishable from successful results; responses never contain undefined text.
- All four tools pass a real stdio client/server smoke test, including successful recipe retrieval.
- Server identity reflects release metadata rather than a stale hard-coded version.
- Invalid requests do not prevent subsequent valid requests on the same session.

### FND-05 — Establish token and design-data ownership

Priority: Next. Dependencies: FND-01; coordinate with ongoing UI styling work.

Inventory overlapping token data and identify authoritative definitions for Citrionus. Apply the flavor contract's distinction between semantic roles, concrete values, modes, and component anatomy.

Acceptance criteria:

- Maintained CSS, preset, AI token, generated DTCG, and anatomy mappings have documented ownership and compatibility boundaries.
- Discrepancies are recorded and reconciled against the intended UI behavior rather than resolved by blindly copying one file over another.
- Derived outputs are generated where practical and checked elsewhere, including unresolved token references.
- Light/dark behavior and newly introduced semantic colors are represented or explicitly identified as unsupported in a particular output.
- No new public token namespace or wholesale token rewrite is required solely to finish the inventory.

### FND-06 — Restore the metadata maintenance pipeline

Priority: Next. Dependencies: FND-01, FND-02, FND-03, and the ownership decisions in FND-05.

Resolve the missing script targets in the [AI package](../packages/rayden-ai/package.json) and provide repeatable generation and validation procedures.

Acceptance criteria:

- Advertised maintenance commands exist and perform the documented work, or are deliberately replaced with accurate commands and migration notes.
- Derived metadata is repeatable; regenerating it without source changes produces no unexplained differences.
- Invalid manifest structure, missing registrations, unsupported export mappings, contradictory rules, and invalid token references fail checks with useful file/component context.
- Authored design intent remains explicit; generation does not invent descriptions or infer runtime behavior solely from types.
- Contributors can follow a documented update sequence after changing a component, token, or recipe.

### FND-07 — Align documentation and verify examples

Priority: Next. Dependencies: FND-01, FND-02, FND-04, and FND-06.

Reconcile the [package README](../packages/rayden-ai/README.md), [AI guide](./rayden-ai.md), [site guide](../packages/docs/content/ai-integration/index.mdx), and agent rules with actual package exports and behavior.

Acceptance criteria:

- Documented imports resolve from the built package and documented MCP names match the server.
- Examples declare required imports, dependencies, and whether code is a complete example or a fragment.
- Complete recipe and manifest examples pass suitable compile or usage checks; representative interactions are reviewed where compilation cannot establish correctness.
- Component counts and capability claims are derived or verified, including the distinction between families and exports.
- Figma anatomy, Rayden MCP, and the external Figma tool are described as separate capabilities with accurate setup requirements.
- Unsupported claims are corrected rather than fulfilled through unrelated scope expansion.

### FND-08 — Introduce minimal Citrionus identity and compatibility metadata

Priority: Before the dependable-baseline release. Dependencies: FND-01 and FND-04.

Identify the existing default library as Citrionus without forcing new imports or building a multi-flavor runtime prematurely.

Acceptance criteria:

- Package metadata and AI responses can identify Citrionus and the release/schema compatibility of the information they provide.
- Defaults and assumptions are visible; the server does not claim to know an installed UI version without client or project evidence.
- Incompatible requested versions receive an explicit limitation rather than silent substitution.
- The minimal metadata shape is documented and compatible with the flavor contract's future capability record.
- Existing consumers retain working imports and the four existing MCP tool names.

Full project detection, flavor switching, and a second flavor remain later-stage work.

### FND-09 — Add a release gate for the AI package

Priority: Before the dependable-baseline release. Dependencies: FND-03, FND-04, FND-06, FND-07, and FND-08.

Add AI-specific checks alongside the existing release workflow. Do not assume that the [root package publishing workflow](../.github/workflows/npm-publish.yml) already validates or publishes the AI package.

Acceptance criteria:

- Continuous integration explicitly builds and checks the AI package, validates the catalog, and exercises the MCP smoke test.
- Tests use the built/package contents where relevant so source-only success cannot hide missing exported assets.
- Package export targets, executable entry points, required token files, and shipped skill/reference paths are verified.
- A form, dashboard, and marketing example provide representative end-to-end evidence for the advertised baseline.
- Required failures stop the relevant release, and the release procedure states which package is being shipped.
- Record the checked UI/AI release combination and remaining limitations.

## Suggested implementation batches

| Batch | Items | Reviewable result |
| --- | --- | --- |
| A — Accurate discovery | FND-01, FND-02 | Supported components resolve correctly and naming contradictions are removed |
| B — Dependable behavior | FND-03, FND-04 | Invalid usage and requests receive meaningful outcomes while valid workflows continue to work |
| C — Sustainable maintenance | FND-05, FND-06, FND-07 | Owned data sources, repeatable checks, and working documentation examples |
| D — Release readiness | FND-08, FND-09 | Explicit Citrionus context and a package-level release gate |

## Later roadmap work

- Stage 3: task-based discovery, richer composition workflows, agent-facing validation, and measured generation evaluations.
- Stage 4: anatomy and variant access through appropriate agent interfaces, connected Figma journeys, and improved starter integration.
- Stage 5: a deliberately different second flavor to validate sharing, packaging, and migration boundaries.
- Stage 6: additional flavor collections, specialized templates, and potential commercial offerings.

## Stage 2 exit review

Review all nine items against their acceptance criteria. Require catalog consistency, meaningful negative-case validation, working documented imports, successful MCP calls, and verified package contents. Record any remaining limitations explicitly. A passing type check alone does not satisfy this milestone.
