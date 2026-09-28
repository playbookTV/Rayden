import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentFamilies,
  componentExists,
  getManifest,
  publicContracts,
  schema,
} from "../src/manifests";
import aliases from "../src/rules/aliases.json";
import { getBlockCatalog } from "../src/blocks";
const base = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
// The authored manifest schema uses this bounded subset of draft-07 keywords.
function validate(value: any, rule: any, path: string): void {
  if (rule.$ref)
    return validate(
      value,
      rule.$ref
        .slice(2)
        .split("/")
        .reduce((o: any, k: string) => o[k], schema),
      path
    );
  const types = Array.isArray(rule.type) ? rule.type : rule.type ? [rule.type] : [];
  const actual = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (types.length && !types.includes(actual)) {
    errors.push(`${path}: expected ${types.join("|")}, got ${actual}`);
    return;
  }
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: unsupported value ${value}`);
  if (value && actual === "object") {
    for (const required of rule.required ?? [])
      if (!(required in value)) errors.push(`${path}: missing ${required}`);
    for (const [key, child] of Object.entries(value)) {
      const definition =
        rule.properties?.[key] ??
        (typeof rule.additionalProperties === "object" ? rule.additionalProperties : undefined);
      if (definition) validate(child, definition, `${path}.${key}`);
    }
  }
  if (actual === "array" && rule.items)
    value.forEach((v: any, i: number) => validate(v, rule.items, `${path}[${i}]`));
}
const knownFiles = new Set(componentFamilies.map((f) => f.manifestFile));
for (const file of readdirSync(resolve(base, "src/manifests")).filter((n) =>
  /^[A-Z].*\.json$/.test(n)
)) {
  if (!knownFiles.has(file)) errors.push(`Orphaned manifest: ${file}`);
  validate(JSON.parse(readFileSync(resolve(base, "src/manifests", file), "utf8")), schema, file);
}
for (const family of componentFamilies) {
  const manifest = getManifest(family.name);
  if (!manifest?.description || !manifest.category)
    errors.push(`${family.name}: missing authored guidance`);
  if (manifest.importPath !== family.importPath)
    errors.push(`${family.name}: incorrect import mapping`);
  for (const name of family.exportNames)
    if (!publicContracts[name] || !getManifest(name))
      errors.push(`${family.name}: unresolvable ${name}`);
}
for (const name of aliases.doesNotExist)
  if (componentExists(name)) errors.push(`Contradictory exclusion: ${name}`);
for (const [alias, target] of Object.entries(aliases.componentAliases)) {
  if (componentExists(alias) && alias !== target)
    errors.push(`Alias overrides exact export: ${alias}`);
  if (target && !componentExists(target))
    errors.push(`Alias target unavailable: ${alias} -> ${target}`);
}
// Block catalog entries name a public export, a source file, a docs page and story
// exports. None of those are derivable from the authored JSON, so check them against
// the real files: a catalog that silently disagrees with the barrel is worse than none.
const uiRoot = resolve(base, "../..");
const blocksBarrel = readFileSync(resolve(uiRoot, "src/blocks/index.ts"), "utf8");
const barrelNames = new Set(blocksBarrel.match(/[A-Za-z_$][\w$]*/g) ?? []);
const blockCatalog = getBlockCatalog();
for (const entry of blockCatalog.entries) {
  const label = `Block ${entry.id}`;
  for (const name of [entry.export, ...entry.types, ...entry.helpers])
    if (!barrelNames.has(name))
      errors.push(`${label}: ${name} is not exported from src/blocks/index.ts`);
  if (!existsSync(resolve(uiRoot, entry.source)))
    errors.push(`${label}: missing source ${entry.source}`);
  if (!existsSync(resolve(uiRoot, entry.previewStories.file)))
    errors.push(`${label}: missing story file ${entry.previewStories.file}`);
  else {
    const stories = readFileSync(resolve(uiRoot, entry.previewStories.file), "utf8");
    if (!stories.includes(`title: "${entry.previewStories.group}"`))
      errors.push(
        `${label}: story group ${entry.previewStories.group} not found in ${entry.previewStories.file}`
      );
    for (const story of entry.previewStories.stories)
      if (!new RegExp(`^export const ${story}\\b`, "m").test(stories))
        errors.push(`${label}: story ${story} not exported from ${entry.previewStories.file}`);
  }
  const page = resolve(uiRoot, `packages/docs/content${entry.docs}.mdx`);
  if (!existsSync(page)) errors.push(`${label}: missing docs page for ${entry.docs}`);
  if (!blockCatalog.vocabularies.tasks.includes(entry.tasks[0]) || !entry.tasks.length)
    errors.push(`${label}: no recognised task tag`);
  if (!entry.domains.length) errors.push(`${label}: no domain tag`);
  if (!entry.states.length) errors.push(`${label}: no documented states`);
  if (!entry.limitations.length) errors.push(`${label}: no recorded limitations`);
  if (!entry.verification.evidence.length) errors.push(`${label}: no verification evidence`);
  if (entry.status === "stable")
    errors.push(
      `${label}: stable requires a screen-reader, multi-engine and OS text-size record that no block has`
    );
}
const barrelExports = new Set(
  [
    ...blocksBarrel.matchAll(
      /^export (?:\{[^}]*\}|type \{[^}]*\}) from "\.\/([A-Za-z]+Block)";$/gms
    ),
  ].map((match) => match[1])
);
for (const name of barrelExports)
  if (!blockCatalog.entries.some((entry) => entry.export === name))
    errors.push(`Uncatalogued public block ${name}`);

const dtcg = JSON.parse(readFileSync(resolve(base, "dist/tokens/tokens.dtcg.json"), "utf8"));
function token(object: any, path: string): any {
  if (!object || typeof object !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(object, path)) return object[path];
  for (const key of Object.keys(object))
    if (path.startsWith(key + ".")) {
      const found = token(object[key], path.slice(key.length + 1));
      if (found !== undefined) return found;
    }
}
const unresolved: Record<string, string[]> = {};
for (const file of readdirSync(resolve(base, "src/anatomy/components"))
  .filter((n) => n.endsWith(".json"))
  .sort()) {
  const text = readFileSync(resolve(base, "src/anatomy/components", file), "utf8");
  for (const [, reference] of text.matchAll(/\{([a-zA-Z][\w.-]+)\}/g))
    if (token(dtcg, reference)?.$value === undefined) {
      const files = (unresolved[reference] ??= []);
      if (!files.includes(file)) files.push(file);
    }
}
const debt = Object.fromEntries(Object.entries(unresolved).sort(([a], [b]) => a.localeCompare(b)));
for (const [reference, files] of Object.entries(debt))
  errors.push(`Unresolved token {${reference}} in ${files.join(", ")}`);
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `Manifest structure, export mappings, aliases, all anatomy token references, and ${blockCatalog.entries.length} block catalog entries verified.`
);
