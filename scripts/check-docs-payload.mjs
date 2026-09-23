// Route-level payload budget for the documentation. Every page used to ship the whole
// component catalog plus all demos through the global MDX map (~2.1 MB gzip on the
// home page); this keeps that from creeping back.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const NEXT = "packages/docs/.next";
const BUDGET_GZIP = 500_000;
const ROUTES = ["index", "components/modal", "components/chart", "blocks/table-block"];

let failed = false;
for (const route of ROUTES) {
  const html = join(NEXT, "server/app", `${route}.html`);
  if (!existsSync(html)) {
    console.error(`MISSING  ${route} (run pnpm docs:build first)`);
    failed = true;
    continue;
  }
  const srcs = [...new Set(
    [...readFileSync(html, "utf8").matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1])
  )];
  let gz = 0;
  for (const s of srcs) {
    const p = join(NEXT, s.replace("/_next/", ""));
    if (existsSync(p)) gz += gzipSync(readFileSync(p)).length;
  }
  const ok = gz <= BUDGET_GZIP;
  if (!ok) failed = true;
  console.log(
    `${ok ? "OK  " : "OVER"}  ${route.padEnd(28)} ${gz.toLocaleString().padStart(9)} gzip bytes ` +
    `(budget ${BUDGET_GZIP.toLocaleString()}, ${srcs.length} scripts)`
  );
}
if (failed) {
  console.error("\nDocumentation route payload exceeds its budget.");
  process.exit(1);
}
