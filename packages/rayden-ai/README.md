# @raydenui/ai

Component contracts, design-token references, icon discovery, and MCP tools for Rayden UI's default **Citrionus** flavor. This package includes both the JavaScript API and the **Rayden MCP server**. Public prop contracts are derived from UI source; design guidance, examples, tokens, and Figma anatomy are maintained reference material.

[![npm version](https://img.shields.io/npm/v/@raydenui/ai.svg)](https://www.npmjs.com/package/@raydenui/ai)

[UI package](https://www.npmjs.com/package/@raydenui/ui) · [Documentation](https://rayden-docs.vercel.app) · [Source](https://github.com/playbookTV/Rayden/tree/main/packages/rayden-ai)

## Connect an AI assistant through MCP

Use a client that can launch local **stdio** MCP servers. Configure:

- **Command:** `npx`
- **Arguments:** `-y`, `@raydenui/ai@latest`

For clients that use an `mcpServers` JSON configuration, the entry looks like this:

```json
{
  "mcpServers": {
    "rayden": {
      "command": "npx",
      "args": ["-y", "@raydenui/ai@latest"]
    }
  }
}
```

Your client determines where this configuration belongs. Node.js and npm must be available to the client. `-y` allows npm to install the package without an interactive prompt. Use an exact package version instead of `latest` when you need a pinned reference.

Verify the executable from a terminal:

```bash
npx -y @raydenui/ai@latest --help
npx -y @raydenui/ai@latest --version
```

Without these flags, the process starts the MCP server and waits for protocol messages on stdin. It is not an HTTP server or a browser page. No Rayden API key is required, and no separate MCP package is needed.

A useful first request to your assistant is: “Use the Rayden MCP tools to discover the available components, inspect Button's props, and validate your proposed usage before writing the UI.”

## MCP tools

| Tool | Inputs and result |
| --- | --- |
| `get_components` | Optional category; families, real exports, and import paths |
| `get_component_props` | Required `component`; source-derived props and inherited attributes |
| `get_tokens` | Optional category; authored design-token reference |
| `get_layout_recipes` | Optional category; authored layout examples |
| `get_catalog` | Optional `flavor` and exact `uiVersion`; reference identity, capabilities, components, motion metadata |
| `get_component_guidance` | Required `component`; structured guidance and copyable `prompt` |
| `validate_component_usage` | Required `component`, `props`; optional array of immediate `children` names |

Component categories include `primitives`, `inputs`, `feedback`, `navigation`, `data-display`, `layout`, and `composite`. Invalid input and lookup failures return `isError: true`. Invalid component usage is a successful validation request whose data contains `valid: false` and errors.

Every response identifies the reference flavor and UI/AI versions. The server does not inspect the consumer's installed packages. Unsupported requested flavors or versions return an explicit error; future flavor support is not implied.

## Use the JavaScript API

Install the reference package alongside the UI library:

```bash
npm install @raydenui/ai @raydenui/ui
```

```ts
import { getCatalog, getComponentGuidance, validateComponentUsage } from '@raydenui/ai';
import { getManifest, getComponentNames } from '@raydenui/ai/manifests';

const catalog = getCatalog();
const guidance = getComponentGuidance('Button');
const button = getManifest('Button');
const names = getComponentNames();
const result = validateComponentUsage('Button', { size: 'sm', 'aria-label': 'Save' });
console.log(catalog.flavor, guidance?.prompt, button?.props, names, result);
```

`ActivityFeed` is a family with `ActivityItem` and `ActivityContent` exports; it is not an importable component. `Chart` resolves to `RaydenChart`, imported from `@raydenui/ui/chart`. Exact supported names always take priority over aliases. Lookups accept unambiguous aliases; validation rejects alias spellings as imports and supplies the real export name.

Each catalog entry includes `name`, `exportNames`, `importPath`, `category`, `description`, `props`, `inheritedProps`, `subComponents`, and `prompt`. Subcomponents have their own contracts. Motion APIs are described separately under `catalog.motion`, including the `@raydenui/ui/motion` import path, actual presets and recipes, and primitive contracts.

Validation checks required props, supported names, enums, primitive types, inherited HTML attributes, and immediate composition constraints. Complex React values, array/object internals, ancestor structure, runtime accessibility, and callback behavior are reported in `notAssessed`. JSON clients can represent a dynamic value as `{ "$expression": "state.size" }`; this is not a validated value. `valid: true` means no demonstrated errors in assessed checks, not complete certification.

## Icon and version discovery

```ts
import { getCatalog } from "@raydenui/ai";

const catalog = getCatalog();
console.log(catalog.uiVersion, catalog.aiVersion);
console.log(catalog.icons.entries.find((entry) => entry.name === "heart"));
// { name: "heart", exportName: "heartIcon" }
```

Use `catalog.icons.entries` for exact icon names and static data exports, and `getComponentGuidance("Icon")` for rendering and accessibility guidance. Static icon data comes from `@raydenui/ui/icons`; the renderer comes from `@raydenui/ui`.

The catalog is a versioned reference snapshot. Check `uiVersion` against your app's UI package before applying its guidance. The `get_catalog` MCP tool can require an exact `uiVersion`; unsupported values return an error. Discover supported component and block contracts through `get_components` or `catalog.components` rather than assuming every UI block has authored AI guidance.

## Figma and tokens

```ts
import { getAnatomy, getAvailableComponents } from '@raydenui/ai/anatomy';
const anatomy = getAnatomy('Button');
```

Anatomy is available through this separate package subpath. Rayden MCP does not control Figma. The included `skills/rayden-use` material requires separately available Figma tools when used for design work.

AI `src/tokens/tokens.json` generates the packaged DTCG JSON at `@raydenui/ai/tokens/dtcg`; runtime CSS and the UI preset remain separate authorities for rendered behavior. Token-reference checks track anatomy resolution; a resolved reference alone does not prove visual parity, dark-mode parity, or correctness of a Figma design.

## Token ownership and compatibility

| Data | Maintained authority | Checked or generated output |
| --- | --- | --- |
| Rendered colors, modes, and utilities | UI `src/styles/globals.css` and `src/preset.ts` | UI build and tests; selected action colors checked against AI data |
| AI reference values | AI `src/tokens/tokens.json` | Packaged DTCG JSON and token helper output |
| Font/spacing primitives | Recorded runtime and Tailwind sources in `tokens.json.referenceSources` | Anatomy references resolve against generated tokens |
| Figma layer structure | AI `src/anatomy/components/*.json` | Packaged anatomy files and token-reference validation |
| Public props and imports | UI exported TypeScript source | Generated contracts, MCP, catalog, and documentation prompts |

The AI/DTCG token snapshot describes default/light values. It does **not** encode the full runtime dark-mode override system. Anatomy reference resolution is now checked with no accepted missing tokens; this does not certify all visual values or every Figma/runtime variant. Update the relevant maintained source before regenerating derived files.

## Working from this repository

Build the UI and verify the AI package from the repository root:

```bash
pnpm install
pnpm build
pnpm check:pilots
node packages/rayden-ai/dist/mcp/server.js --help
```

For an MCP client using this checkout, use command `node` with the absolute path to `packages/rayden-ai/dist/mcp/server.js`. Rebuild after source changes. The npm command runs the published package, not your checkout.

## Maintenance and verification

When updating contracts or guidance, run these commands inside `packages/rayden-ai` after building the UI:

```sh
npm run generate-manifests
npm run generate-catalog
npm run typecheck
npm run build
npm run validate-manifests
npm run check-generated
npm test
```

`generate-manifests` now generates `src/manifests/contracts.generated.json` from the actual public UI exports and TypeScript prop types. It does not invent authored descriptions or runtime defaults. `generate-catalog` writes `../docs/public/ai/catalog.json`. Both generated outputs have stale-file checks. Update authored descriptions/examples deliberately when changing behavior, then regenerate and review the diff.

The checks cover export mapping completeness, authored manifest structure, contradictory aliases/exclusions, token references, built ESM/CommonJS exports, packed asset paths, and a real stdio MCP client/server session. Examples are authored JSX fragments that can require surrounding imports, state, or dependencies; all examples are not certified end-to-end applications.

## License

MIT.
