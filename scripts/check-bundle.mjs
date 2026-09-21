import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import path from "node:path";

// Use the bundler already pinned by tsup in the lockfile.
const require = createRequire(import.meta.url);
const { buildSync } = createRequire(require.resolve("tsup"))("esbuild");
for (const [name, contents, budget] of [
  ["Button", 'export { Button } from "./dist/index.js";', 15000],
  [
    "Static icon",
    'export { Icon } from "./dist/index.js"; export { homeIcon } from "./dist/icons.js";',
    15000,
  ],
]) {
  const result = buildSync({
    stdin: { contents, resolveDir: process.cwd(), sourcefile: "consumer.js" },
    bundle: true,
    minify: true,
    format: "esm",
    splitting: true,
    outdir: "/tmp/rayden-bundle-check",
    external: ["react", "react-dom", "react-hook-form", "chart.js", "react-chartjs-2"],
    write: false,
    metafile: true,
  });
  const outputs = Object.entries(result.metafile.outputs);
  const entry = outputs.find(([, info]) => info.entryPoint === "consumer.js");
  assert.ok(entry, "Consumer entry output must exist");
  const initial = new Set();
  function visit(file) {
    if (initial.has(file)) return;
    initial.add(file);
    for (const dependency of result.metafile.outputs[file].imports) {
      if (!dependency.external && dependency.kind !== "dynamic-import") visit(dependency.path);
    }
  }
  visit(entry[0]);
  const bytes = result.outputFiles
    .filter((file) => [...initial].some((key) => file.path === path.resolve(key)))
    .reduce((sum, file) => sum + gzipSync(file.contents).length, 0);
  assert.ok(bytes > 0, "Must measure a nonempty initial bundle");
  console.log(
    `${name}: ${bytes.toLocaleString()} initial gzip bytes (budget ${budget.toLocaleString()})`
  );
  assert.ok(bytes <= budget, `${name} exceeds its initial bundle budget`);
}
