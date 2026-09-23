import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = JSON.parse(
  await readFile(path.join(root, "packages/docs/public/ai/catalog.json"), "utf8")
);
if (
  !Array.isArray(catalog.components) ||
  catalog.components.some((entry) => typeof entry.prompt !== "string")
) {
  throw new Error("Generate the canonical AI catalog before generating guidance.");
}
const intro = `# Rayden UI — Citrionus\n\nCitrionus is Rayden's complete free default flavor.\n\nReference UI: ${catalog.uiVersion}\nAI package: ${catalog.aiVersion}\nCatalog schema: ${catalog.schemaVersion}\n\nThis is reference information. Inspect the consuming project's installed version before generating code. Future flavors are not advertised as available.\n`;
const index = catalog.components
  .map(
    (entry) =>
      `- ${entry.name}: ${entry.exportNames.join(", ")} from ${entry.importPath} — ${entry.description}`
  )
  .join("\n");
const motion = Object.values(catalog.motion?.exports ?? {});
if (motion.some((entry) => typeof entry.prompt !== "string")) {
  throw new Error("Motion guidance is missing from the canonical catalog.");
}
const motionIndex = motion.map((entry) => `- ${entry.name} from ${entry.importPath}`).join("\n");
const motionGuidance = motion.map((entry) => `### ${entry.name}\n\n${entry.prompt}`).join("\n\n");
const routes = `\n## Read next\n\n- /ai-integration: AI package, MCP, and copyable component guidance.\n- /ai/catalog.json: Canonical structured component catalog, props, and prompts.\n- /ai-integration/distribution: Local registry pilot and editable-source boundaries.\n- /motion: Opt-in motion pilot, presets, and reduced-motion behavior.\n- /r/registry.json: Registry pilot catalog; use the documented local setup.\n\n## Conventions\n\nUse actual named exports and their declared import paths. Preserve state, accessibility, styling tokens, and application logic. Resolve exact component names before aliases. Report unknown components or unsupported versions. Keep operating-system reduced-motion preferences effective. Do not assume registry endpoints or unreleased APIs are published.\n`;
const outputs = {
  "llms.txt": `${intro}${routes}\n## Components\n\n${index}\n\n## Motion APIs\n\n${motionIndex}\n`,
  "llms-full.txt": `${intro}${routes}\n## Component guidance\n\n${catalog.components.map((entry) => `### ${entry.name}\n\n${entry.prompt}`).join("\n\n")}\n\n## Motion guidance\n\n${motionGuidance}\n`,
};
for (const [name, content] of Object.entries(outputs)) {
  const destination = path.join(root, "packages/docs/public", name);
  if (process.argv.includes("--check")) {
    const existing = await readFile(destination, "utf8").catch(() => "");
    if (existing !== content)
      throw new Error(`${name} is stale. Run pnpm guidance:build after generating the AI catalog.`);
  } else {
    await writeFile(destination, content);
  }
}
console.log(
  `${process.argv.includes("--check") ? "Checked" : "Generated"} guidance for ${catalog.components.length} component families.`
);
