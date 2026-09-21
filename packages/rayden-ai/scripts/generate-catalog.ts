import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCatalog } from "../src/catalog";
const path = resolve(dirname(fileURLToPath(import.meta.url)), "../../docs/public/ai/catalog.json");
const content = JSON.stringify(getCatalog(), null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8") !== content)
    throw new Error(
      "Published docs catalog is stale. Run npm run generate-catalog in packages/rayden-ai."
    );
} else {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
console.log("Docs catalog is current.");
