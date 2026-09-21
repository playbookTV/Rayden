/** Ship the raw reference files used by the bundled skill, alongside JS exports. */
import { cpSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { componentFamilies, getManifest } from "../src/manifests";
import { getCatalog } from "../src/catalog";
const base = resolve(dirname(fileURLToPath(import.meta.url)), "..");
cpSync(resolve(base, "src/anatomy"), resolve(base, "dist/anatomy"), {
  recursive: true,
  filter: (path) => statSync(path).isDirectory() || path.endsWith(".json"),
});
mkdirSync(resolve(base, "dist/manifests"), { recursive: true });
writeFileSync(
  resolve(base, "dist/manifests/components.json"),
  JSON.stringify(getCatalog(), null, 2) + "\n"
);
for (const family of componentFamilies) {
  const manifest = { ...getManifest(family.name) };
  delete manifest.$schema; // generated public contract uses schemaVersion, not the authored-input schema
  writeFileSync(
    resolve(base, "dist/manifests", family.manifestFile),
    JSON.stringify(manifest, null, 2) + "\n"
  );
}
