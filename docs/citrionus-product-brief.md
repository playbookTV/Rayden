# Citrionus product brief

Status: Working product definition derived from the agreed Rayden vision.
Date: 20 September 2026.
Parent: [Vision and roadmap](./vision-and-roadmap.md).

## Positioning

Citrionus is Rayden's complete, free default flavor: a calm, approachable interface system for product teams building React applications. It combines reusable components, useful composition patterns, and reliable guidance for developers, designers, and AI agents.

Its promise is to help teams build a coherent, finished interface without having to invent a design system or correct conflicting component guidance.

## Audience and jobs

The audience is broad product teams, consistent with the owner's existing [design context](../.impeccable.md). The following jobs focus the initial experience without narrowing the library to a single industry.

| User | Job | Successful outcome |
| --- | --- | --- |
| Product developer | Assemble forms, navigation, tables, and feedback into a working application | Predictable APIs, accessible defaults, and examples that compile |
| Small team or independent builder | Start a product and keep its screens visually coherent | A useful starter, dependable components, and a clear path from individual controls to complete layouts |
| Product designer | Specify reusable interfaces that engineering can implement | Corresponding tokens, component structures, and documented interaction states |
| Developer working with an agent | Describe an interface and refine the result | The agent discovers real components and uses the installed version correctly |
| Library evaluator | Decide whether Citrionus fits a project | Representative examples, clear capability boundaries, and transparent setup requirements |

## Design identity

Carry forward the established direction rather than introducing a visual rebrand:

- **Calm:** clear hierarchy, restrained decoration, comfortable spacing, and purposeful motion.
- **Approachable:** familiar interactions, readable labels, and useful empty, error, and success states.
- **Clear:** legible text, distinguishable controls, predictable emphasis, and examples that communicate real usage.
- **Recognizable:** preserve the orange accent and restrained component styling. Use accent color with a clear purpose and maintain accessible contrast.

Typography, shape, density, and motion should feel consistent across components and layouts. Detailed token values remain an implementation specification; this brief does not introduce new fonts or silently replace existing values.

Light and dark appearances are modes within Citrionus. Brand customization is also possible within a flavor. Neither requires a new flavor identity by itself.

## Initial scope

The initial product definition covers the existing React component library, its design tokens and icons, documented composition patterns, starter projects, and AI knowledge layer. The current default library is the starting point for Citrionus; establishing the name does not require consumers to change package imports.

Core journeys:

1. Build a form with labels, validation feedback, a primary action, and a clear completion state.
2. Build a dashboard with navigation, metrics, tabular information, and empty states.
3. Build a product or marketing section with a clear hierarchy and a meaningful action.
4. Ask an agent to build one of those interfaces, inspect the result, and correct unsupported usage.

These are reference journeys, not a requirement to provide every application feature. Authentication services, payment processing, data storage, and business logic remain the consuming application's responsibility. Examples must distinguish working UI behavior from sample data and external integrations.

## Free default commitment

Citrionus includes the components, accessibility work, documentation, and fundamental AI support needed to build finished products. It must not require a paid flavor to make a common control usable or to obtain accurate API guidance.

Future commercial offerings may add identities, collections, templates, or support. This brief does not change the repository's license or establish pricing.

## Experience requirements

### Development

Setup explains imports, styles, supported peers, and optional dependencies. Components expose predictable state and event semantics. Recipes identify required imports and whether they are complete examples or deliberately bounded fragments.

### Design

Figma guidance identifies the corresponding flavor and component version. Differences between a design specification and the implemented component are visible. Claims of parity require verification rather than matching names alone.

### AI

An agent can identify the flavor and version, discover supported components, retrieve exact props and examples, and check usage. Unknown or unsupported information produces an explicit limitation or actionable error, never a fabricated API.

### Accessibility and responsiveness

Keyboard behavior, focus handling, labels, semantic structure, contrast, and responsive layouts are baseline quality requirements. Verification should combine appropriate automated checks with interaction review; this document makes no compliance certification claim.

## Definition of a dependable baseline

- Every advertised component has a valid public export mapping, discoverable manifest, and checked usage example.
- Rules and aliases do not contradict supported exports.
- Documentation and examples work with the stated release.
- Reference journeys handle the relevant loading, empty, error, success, and disabled states without inventing component props.
- Light and dark modes remain readable and preserve interaction meaning.
- Code, MCP, and Figma guidance clearly identify their supported scope and known differences.

## Boundaries and next decisions

The immediate work is to make the existing Citrionus foundation dependable. A separate hosted generation application, additional framework implementations, and a second flavor are later product decisions.

The next implementation planning step is the [foundation backlog](./foundation-backlog.md), governed by the [flavor contract](./flavor-contract.md). Release dates, final packaging for multiple flavors, and numerical adoption targets remain unset.
