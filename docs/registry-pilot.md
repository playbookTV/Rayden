# Citrionus distribution pilot

This is a **local, package-backed registry pilot**, not a published registry service. Citrionus remains Rayden's complete free default. This pilot advertises no additional flavors and copies no component internals.

## What is installed

| Item | Editable application files | Package-managed behavior |
| --- | --- | --- |
| `@rayden/setup` | `styles/rayden.css`, a global stylesheet entry | Compiled Citrionus styles from `@raydenui/ui` |
| `@rayden/rules` | `rayden/RAYDEN.md`, generated version-specific guidance | Canonical component knowledge comes from `@raydenui/ai` |
| `@rayden/button-actions` | Save/cancel composition with a busy state | `Button` |
| `@rayden/workspace-tabs` | Workspace navigation and panel composition | `Tabs`, `Tab` |
| `@rayden/motion-tabs` | Segmented tabs with opt-in motion | `Tabs`, `Tab`, `MotionProvider` |

The three blocks explicitly depend on `@rayden/setup` and `@rayden/rules`. Bare dependency names are not used: in shadcn, bare `button` means shadcn's component, not Rayden's. The pilot pins the runtime to the UI version in the canonical catalog. Applications must already provide React and React DOM; the supported smoke fixture uses React 19.

Import `styles/rayden.css` once from the application entry point or global stylesheet. Installing the registry does not automatically wire that stylesheet into your app, create routes, or change your theme configuration. The rules file is reference material for an assistant to read explicitly; installation does not activate an assistant configuration.

## Generate and inspect

From the repository root:

```sh
pnpm --filter @raydenui/ai build
pnpm registry:build
pnpm registry:check
```

Generation reads `getCatalog()` and `getComponentGuidance()` from the current AI build. It fails on stale package versions, missing components, missing prompts, unqualified registry dependencies, or invalid official shadcn schemas. `registry:check` additionally detects output drift.

`registry/items.mjs` holds distribution choices and block descriptions. Component names, import paths, exports, descriptions, versions, and agent prompts come from the canonical catalog. Do not edit the generated root `registry.json`, generated rules, or the JSON under `packages/docs/public/r` directly.

The generated index is `/r/registry.json`. Item payloads are under `/r/<item>.json` and `/r/citrionus-<ui-version>-pilot.1/<item>.json`. The version directory includes an index too. Both are local build outputs until a separate publication step is performed. Before a release, change the registry revision when content changes and treat released version paths as immutable. The current `pilot.1` is unreleased and can be regenerated during development.

## Use the local namespace

Run the docs locally (`pnpm run docs`). Add this to an existing supported app's `components.json`, replacing the port and UI version to match the local docs server and generated output:

```json
{
  "registries": {
    "@rayden": "http://localhost:3001/r/citrionus-0.9.7-pilot.1/{name}.json"
  }
}
```

Then inspect and add an item with the pinned CLI:

```sh
pnpm dlx shadcn@4.21.0 view @rayden/button-actions
pnpm dlx shadcn@4.21.0 add @rayden/button-actions
```

These commands require that local server to be running. No `@rayden` entry in the public shadcn directory or hosted Rayden URL is claimed. Future hosted delivery should use HTTPS and a fixed release path.

The pilot's motion code is unreleased source work while the UI version remains `0.9.7`. Installing a published package with that same version does **not** prove it contains these changes. Use the fresh local package verification below; before external distribution, release a new UI version containing the motion export and regenerate the catalog and registry pins.

## Verify the real installer against a fresh local package

Build the current UI, pack it into a temporary directory, and pass the resulting absolute tarball path:

```sh
pnpm build
npm pack --ignore-scripts --pack-destination /private/tmp
pnpm registry:smoke --tarball /private/tmp/raydenui-ui-0.9.7.tgz
```

The smoke script creates a clean React/TypeScript/Vite application, serves the generated item payloads on a temporary localhost port, configures `@rayden`, and invokes the **actual shadcn 4.21.0 CLI**. It checks that all three blocks plus their setup/rules dependencies were requested and written, then typechecks and bundles the installed application.

Only that temporary test server substitutes the freshly packed local tarball for the exact npm dependency, because this work has not been released. The generated registry keeps the real version pin. The test reports this substitution and retains the fixture path for inspection. Network access is required for fixture dependencies and the official CLI's own registry checks. No homemade installer or source alias substitutes for a successful CLI run.

## Ownership and updates

- Applications own the copied compositions, stylesheet entry, and guidance snapshot. Customize these files in application version control.
- Rayden owns the packaged component behavior, accessibility, tokens, and motion implementation. Upgrade the npm package intentionally and review its compatibility guidance.
- Reinstalling a block is not an automatic merge or migration. Inspect the new item with `view`, compare with the application's files, and merge intended changes. Do not use `--overwrite` on locally edited blocks without reviewing the diff.
- A catalog describes upstream components, not arbitrary local modifications. Agents should read edited blocks before changing them and report unsupported assumptions rather than treating them as stock Rayden.
- Registry acquisition and Rayden AI/MCP guidance are complementary. Registry tools copy code; Rayden's MCP explains the supported APIs, versions, composition rules, and validation limitations.

## Official references

- [Registry item schema and dependency addressing](https://ui.shadcn.com/docs/registry/registry-item-json)
- [Namespace configuration](https://ui.shadcn.com/docs/registry/namespace)
- [Published schema APIs](https://ui.shadcn.com/docs/registry/api-reference)

The tooling pins shadcn `4.21.0`, verified on 21 September 2026. Changing that version requires repeating schema validation and the real install smoke test.

## Pilot verification record

On 21 September 2026, all five items passed the official schemas and the official `shadcn build` command. The clean fixture installed all three blocks and their two namespaced dependencies through the real CLI, then passed TypeScript checking and a Vite production build using the freshly packed local UI package. This validates local distribution, not availability of an equivalent published npm release. The build reported nonfatal warnings for React client directives and the existing large icon chunk.
