// Gate the contracts a packed consumer depends on: subpath resolution with no optional
// chart peers installed, and server rendering of an initially open portal. These broke
// in the field while every unit test passed.
import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "rayden-consumer-"));
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
console.log(`packing @raydenui/ui@${version} -> ${dir}`);
execSync(`npm pack --pack-destination ${dir}`, { stdio: "ignore" });
writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "c", private: true, type: "module" }));
// react/react-dom only: the chart peers are optional and must stay uninstalled.
execSync(`npm install ./raydenui-ui-${version}.tgz react react-dom --no-audit --no-fund --silent`, {
  cwd: dir, stdio: "ignore",
});

writeFileSync(join(dir, "check.mjs"), `
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
const fail = (m) => { console.error("FAIL " + m); process.exitCode = 1; };
const root = await import("@raydenui/ui");
if ("RaydenChart" in root) fail("root re-exports RaydenChart; optional chart peers become required");
const blocks = await import("@raydenui/ui/blocks");
if (Object.keys(blocks).length === 0) fail("@raydenui/ui/blocks resolved but exported nothing");
try { renderToString(h(root.Modal, { open: true, onClose() {}, title: "x" }, "body")); }
catch (e) { fail("initially open Modal crashes server rendering: " + e.message); }
if (!process.exitCode) console.log("consumer contracts OK");
`);
execSync("node check.mjs", { cwd: dir, stdio: "inherit" });
