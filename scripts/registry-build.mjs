import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { pilotItems } from "../registry/items.mjs";

export const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(process.env.RAYDEN_REGISTRY_TOOLING || import.meta.url);
const { registrySchema, registryItemSchema } = await import(
  pathToFileURL(require.resolve("shadcn/schema"))
);

export async function generateRegistry({ check = false } = {}) {
  const { getCatalog, getComponentGuidance } = await import("../packages/rayden-ai/dist/index.js");
  const catalog = getCatalog();
  if (catalog.flavor !== "citrionus") throw new Error("This pilot only supports Citrionus.");
  const runtime = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const ai = JSON.parse(await readFile(path.join(root, "packages/rayden-ai/package.json"), "utf8"));
  if (catalog.uiVersion !== runtime.version || catalog.aiVersion !== ai.version) {
    throw new Error(
      "Catalog versions are stale. Rebuild @raydenui/ai before generating the registry."
    );
  }
  const version = `citrionus-${catalog.uiVersion}-pilot.1`;
  const outputs = new Map();
  const rulesPath = "registry/citrionus/rules/RAYDEN.md";
  const rules = [
    "# Rayden Citrionus guidance",
    "",
    `Generated for @raydenui/ui ${catalog.uiVersion}, @raydenui/ai ${catalog.aiVersion}; catalog schema ${catalog.schemaVersion}.`,
    "",
    "Citrionus is the complete free default. This registry pilot installs editable application compositions; component internals remain in @raydenui/ui. No additional flavors are supported by this pilot.",
    "",
    "Read the installed package version before applying this guidance. Use Rayden AI/MCP for the matching version. Local edits to copied blocks belong to the application and are not automatically validated by package metadata. Import @raydenui/ui/styles.css once. Motion is optional; import its API from @raydenui/ui/motion and honor reduced motion.",
    "",
    ...catalog.components.flatMap((component) => {
      const guidance = getComponentGuidance(component.name);
      if (!guidance || typeof guidance.prompt !== "string") {
        throw new Error(`Missing canonical prompt for ${component.name}`);
      }
      return [`## ${component.name}`, "", guidance.prompt, ""];
    }),
  ].join("\n");
  outputs.set(rulesPath, rules);

  const sourceItems = [];
  const builtItems = [];
  for (const { components: componentNames, ...definition } of pilotItems) {
    const components = componentNames.map((name) => {
      const component = catalog.components.find((candidate) => candidate.name === name);
      if (!component)
        throw new Error(`Registry item ${definition.name} uses unknown component ${name}`);
      return {
        name: component.name,
        exportNames: component.exportNames,
        importPath: component.importPath,
        description: component.description,
      };
    });
    for (const dependency of definition.registryDependencies || []) {
      if (
        !dependency.startsWith("@rayden/") ||
        !pilotItems.some((item) => `@rayden/${item.name}` === dependency)
      ) {
        throw new Error(`Unresolved or unqualified registry dependency ${dependency}`);
      }
    }
    const item = {
      ...definition,
      dependencies: definition.name === "rules" ? [] : [`@raydenui/ui@${catalog.uiVersion}`],
      meta: {
        rayden: {
          schemaVersion: catalog.schemaVersion,
          flavor: catalog.flavor,
          uiVersion: catalog.uiVersion,
          aiVersion: catalog.aiVersion,
          registryVersion: version,
          distribution: "package-backed",
          status: "local-pilot",
          components,
        },
      },
    };
    registryItemSchema.parse(item);
    sourceItems.push(item);
    const builtItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files: await Promise.all(
        item.files.map(async (file) => ({
          ...file,
          content: outputs.get(file.path) ?? (await readFile(path.join(root, file.path), "utf8")),
        }))
      ),
    };
    registryItemSchema.parse(builtItem);
    builtItems.push(builtItem);
  }
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "rayden",
    homepage: "https://github.com/raydenui/rayden",
    items: sourceItems,
  };
  registrySchema.parse(registry);
  outputs.set("registry.json", `${JSON.stringify(registry, null, 2)}\n`);
  for (const directory of ["packages/docs/public/r", `packages/docs/public/r/${version}`]) {
    outputs.set(`${directory}/registry.json`, `${JSON.stringify(registry, null, 2)}\n`);
    for (const item of builtItems) {
      outputs.set(`${directory}/${item.name}.json`, `${JSON.stringify(item, null, 2)}\n`);
    }
  }
  for (const [relative, content] of outputs) {
    const target = path.join(root, relative);
    if (check) {
      const actual = await readFile(target, "utf8").catch(() => "");
      if (actual !== content) throw new Error(`Stale generated registry output: ${relative}`);
    } else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
  }
  console.log(
    `${check ? "Checked" : "Generated"} ${builtItems.length} registry items using official shadcn schemas (${version}).`
  );
  return { registry, version, builtItems };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateRegistry({ check: process.argv.includes("--check") });
}
