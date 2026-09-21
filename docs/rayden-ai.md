# Rayden AI and connected guidance

Citrionus is Rayden’s complete free default flavor. The AI package provides component knowledge through programmatic exports and a local stdio MCP server. Its generated catalog also drives the documentation’s Copy Prompt controls and the registry pilot.

This development pilot is implemented in the workspace. It has not been published to npm or deployed by this work.

## Build and inspect

```sh
pnpm --filter @raydenui/ai build
node packages/rayden-ai/dist/mcp/server.js
```

Use the absolute built server path when configuring an MCP client from another directory. Keep protocol communication on stdout and operational logging on stderr.

## Interfaces

The original tools remain: `get_components`, `get_component_props`, `get_tokens`, and `get_layout_recipes`. Additional tools expose `get_catalog`, `get_component_guidance`, and `validate_component_usage`.

```ts
import { getCatalog, getComponentGuidance, getManifest, validateComponentUsage } from "@raydenui/ai";

const catalog = getCatalog();
const component = getManifest("Button");
const guidance = getComponentGuidance("Button");
const invalid = validateComponentUsage("Button", { size: "giant" });
```

Use catalog `exportNames` and `importPath` instead of assuming a family name is importable. Validation separates errors, warnings, and checks that were not assessed; it cannot prove runtime behavior or accessibility.

## Shared information

The canonical catalog identifies the reference UI release, AI release, schema, and Citrionus capabilities. This does not detect the consumer’s installed version. Generated documentation lives in `packages/docs/public/ai/catalog.json`, `llms.txt`, and `llms-full.txt`.

See the [site guide](../packages/docs/content/ai-integration/index.mdx), [registry pilot](./registry-pilot.md), [flavor contract](./flavor-contract.md), and [foundation backlog](./foundation-backlog.md).

## Distribution boundaries

The registry installs editable setup, rules, and examples backed by the UI package. The existing MCP supplies component information and validation. The registry pilot uses local serving and fixtures; no remote namespace is claimed as live.

## Motion and Figma

Motion is an opt-in pilot exposed through `@raydenui/ui/motion`, with Tabs and Modal preserving their default behavior until motion is requested. Operating-system reduced-motion preferences constrain every requested preset.

Figma anatomy and skills remain separate guidance assets. Writing designs requires a connected Figma tool; metadata availability is not proof of full design/runtime parity.
