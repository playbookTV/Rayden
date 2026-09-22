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
writeFileSync(
  join(dir, "package.json"),
  JSON.stringify({ name: "c", private: true, type: "module" })
);
// react/react-dom only: the chart peers are optional and must stay uninstalled.
execSync(`npm install ./raydenui-ui-${version}.tgz react react-dom --no-audit --no-fund --silent`, {
  cwd: dir,
  stdio: "ignore",
});

writeFileSync(
  join(dir, "check.mjs"),
  `
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
const fail = (m) => { console.error("FAIL " + m); process.exitCode = 1; };
const root = await import("@raydenui/ui");
if ("RaydenChart" in root) fail("root re-exports RaydenChart; optional chart peers become required");
const blocks = await import("@raydenui/ui/blocks");
const expectedBlocks = ["NotificationsBlock", "LoginBlock", "TableBlock", "QuickSendBlock", "RecentTransactionsBlock", "EmptyStateBlock", "SearchableTableBlock", "HeaderBlock", "CreateAccountBlock", "KpiOverviewBlock", "ProfileSettingsBlock", "TaskListBlock", "ProductHeroBlock", "FeatureOverviewBlock", "PricingPlansBlock", "SiteFooterBlock", "ProductCollectionBlock", "ProductDetailBlock", "ShoppingCartBlock", "CheckoutReviewBlock", "ApplicationShellBlock", "PageHeaderBlock", "WorkspaceSwitcherBlock", "CommandPaletteBlock"];
for (const name of expectedBlocks) if (!blocks[name]) fail(name + " missing from blocks export");
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const cjsBlocks = require("@raydenui/ui/blocks");
for (const name of expectedBlocks) if (!cjsBlocks[name]) fail(name + " missing from CommonJS blocks export");
for (const peer of ["chart.js", "react-chartjs-2"]) {
  try { require.resolve(peer); fail(peer + " unexpectedly installed; optional-peer check is invalid"); } catch {}
}
const product = { id: "cup", name: "Cup", price: 2400, stock: 3 };
const cases = [
  ["ApplicationShellBlock", { children: h("h1", null, "Workspace") }],
  ["PageHeaderBlock", { title: "Projects" }],
  ["WorkspaceSwitcherBlock", { workspaces: [{ id: "a", name: "Acme", href: "/acme" }], defaultOpen: true }],
  ["CommandPaletteBlock", { items: [], defaultOpen: true }],
  ["KpiOverviewBlock", { period: { label: "Now", comparisonLabel: "Before" }, metrics: [{ id: "orders", label: "Orders", value: "10", trend: { labels: ["A", "B"], values: [5, 10] } }] }],
  ["ProductCollectionBlock", { products: [product] }],
  ["ProductDetailBlock", { product }],
  ["ShoppingCartBlock", { items: [{ ...product, quantity: 2 }] }],
  ["CheckoutReviewBlock", { items: [{ ...product, quantity: 2 }], deliveryAddress: ["Example address"], deliveryMethod: "Standard", paymentSummary: "Visa ending in 4242" }],
];
for (const [name, props] of cases) {
  try { renderToString(h(blocks[name], props)); }
  catch (e) { fail(name + " crashes server rendering: " + e.message); }
}
try { renderToString(h(root.Modal, { open: true, onClose() {}, title: "x" }, "body")); }
catch (e) { fail("initially open Modal crashes server rendering: " + e.message); }
if (!process.exitCode) console.log("consumer contracts OK");
`
);
execSync("node check.mjs", { cwd: dir, stdio: "inherit" });
