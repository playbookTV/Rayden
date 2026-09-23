# Rayden vision and roadmap

Status: Agreed product direction. Foundation, motion, distribution, and connected-guidance pilots are implemented locally; release dates remain uncommitted.
Agreed: 20 September 2026.

## Vision

Rayden is a family of design systems built for developers, designers, and AI agents. Citrionus is the complete, free default flavor.

Choose a Rayden flavor and build a coherent interface. Whether you work through code, Figma, or an AI assistant, the components, guidance, and resulting experience stay aligned.

## Product roles

| Part | Role |
| --- | --- |
| Rayden | The umbrella for shared engineering, tooling, quality standards, and the ecosystem. |
| Citrionus | The default flavor, a complete production foundation and the easiest entry point. |
| Future flavors | Distinct visual identities built on shared foundations, with explicit additions where needed. |
| Rayden AI | The knowledge and validation layer that makes each flavor understandable to agents. |
| MCP | An interface through which agents discover and use Rayden's knowledge and capabilities. |
| Figma, documentation, and scaffolding | Connected ways to design, learn, and start building with the same system. |

## What a flavor means

A flavor is a coherent visual system spanning typography, color, shape, density, motion, and composition. It can also include distinctive blocks and recipes.

Flavors share core component behavior and APIs wherever practical. Accessibility, state semantics, and common interactions belong in those shared foundations. A flavor may add components or capabilities, but those differences must be discoverable and documented.

Switching flavors should preserve application logic for the shared component contract. Flavor-specific additions may require migration; tooling must identify those differences rather than promise universal interchangeability.

Define the flavor contract early. Validate the implementation with a deliberately different second flavor before investing in a broad flavor framework.

## Product principles

1. **Citrionus is complete in its own right.** Free users can build finished products with accessible components, documentation, and AI support. Core quality is not a paid upgrade.
2. **Flavors retain their character.** Shared engineering supports distinct visual identities without forcing every design into the same proportions and layout patterns.
3. **AI support belongs to every flavor.** Accurate discovery, supported usage, and clear limitations are fundamental product capabilities.
4. **Every surface has an authoritative source.** Define ownership for component APIs, tokens, composition guidance, and design specifications. Generate derived information where practical and automatically check the parts that must remain separately authored.
5. **Flavor and version are explicit.** Agents must know the selected flavor, installed release, and supported capabilities before recommending components or generating code.
6. **Reliability precedes expansion.** Prove that existing components and examples work before expanding the advertised capability set.

## Desired user experience

- Developers choose a flavor, start a project, and use predictable components with clear customization boundaries.
- Designers use corresponding Figma specifications, tokens, and reusable patterns that retain the flavor's identity.
- Agents identify the project's flavor and version, discover suitable components, retrieve exact usage, compose a solution, and validate supported usage.
- Maintainers update authoritative definitions and receive useful failures when code, AI data, examples, or design specifications drift apart.

## Roadmap

Stages are ordered by dependencies and completion criteria. They are not calendar commitments.

### 1. Product definition

Define Citrionus's audience, visual principles, supported use cases, and initial product scope. Specify the flavor contract: what is shared, what can vary, how additions are declared, and what switching flavors means.

**Complete when:** Citrionus has a written product definition and the flavor contract is concrete enough to guide implementation. Working definitions are available in the linked planning deliverables below; implementation should test and refine their detailed choices.

### 2. Trustworthy Citrionus foundation

Align component exports, discovery, manifests, aliases, rules, and examples. Repair contradictory guidance and missing registrations. Establish repeatable manifest checks, meaningful validation, MCP error handling, and version reporting.

**Complete when:** Every advertised component is discoverable and has accurate usage information; supported examples pass appropriate checks; unsupported usage produces actionable results; automated checks catch drift.

### 3. Useful AI workflows

Make discovery aware of flavor and version. Add task-based component selection, composition guidance, recipe retrieval, and meaningful validation. Evaluate representative tasks such as a form, a dashboard, and a marketing section.

**Complete when:** An agent can assemble and check representative interfaces with supported APIs, and failures can be traced to specific missing or incorrect guidance.

### 4. Connected design and development

Align Figma specifications, documentation, starter projects, and installation guidance. Make relevant anatomy and variant information available to agent workflows. Explain which actions require external tools such as Figma.

**Complete when:** A documented journey takes a user from selecting Citrionus to a working interface, with consistent guidance across the supported design and development surfaces.

### 5. Prove the flavor model

Build a deliberately different second flavor. Test shared behavior, visual overrides, flavor-specific additions, packaging, capability discovery, and migration boundaries.

**Complete when:** Two distinct flavors work without duplicating the entire library, and tooling accurately identifies shared and incompatible capabilities.

### 6. Grow the ecosystem

Expand flavors, block collections, specialized templates, and support according to demonstrated demand and maintenance capacity.

**Complete when:** Each expansion has a clear audience, a sustainable maintenance path, and the same core quality and AI support standards.

## Commercial direction

Keep Citrionus free and suitable for complete products. Explore paid additional design identities, extensive block collections, specialized templates, and support. Pricing, licensing, and which future offerings are paid remain open decisions; not every future flavor must be commercial.

## Success measures

- Coverage: advertised components have accurate, retrievable manifests and examples.
- Correctness: invalid names, props, and compositions are detected with useful explanations.
- Consistency: changes that cause drift across maintained surfaces fail automated checks.
- Workflow quality: representative agent-generated interfaces use supported APIs and satisfy the selected flavor's guidance.
- Adoption experience: users can reach a working interface through documented setup steps.
- Flavor viability: a second identity reuses the shared contract while preserving meaningful visual differences.

Establish baselines and numerical targets during the relevant stage rather than inventing targets in advance.

## Planning deliverables

The working definitions and implementation plan are now recorded:

1. [Citrionus product brief](./citrionus-product-brief.md) — intended users, visual identity, use cases, and scope.
2. [Flavor contract](./flavor-contract.md) — shared behavior, visual variation, capability declarations, and compatibility boundaries.
3. [Foundation backlog](./foundation-backlog.md) — nine ordered work items with acceptance criteria mapped to stage 2.

The first implementation swarm has delivered the canonical catalog, corrected existence rules and aliases, structured validation, MCP improvements, and connected motion/distribution pilots. See the [implementation report](./implementation-pilots-2026-09-21.md) for evidence and remaining release criteria. This does not close every stage or certify full Figma/runtime parity.

Package names, repository restructuring, a hosted generation product, release dates, and pricing are not decided by this roadmap. Implementation changes should follow the agreed product and flavor definitions.
