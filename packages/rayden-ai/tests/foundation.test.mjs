import process from "node:process";
import { URL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import {
  getCatalog,
  getComponentGuidance,
  getManifest,
  componentExists,
  resolveAlias,
  validateComponentUsage,
  VERSION,
  getSpacing,
  getTypography,
} from "@raydenui/ai";
import { callTool, tools } from "@raydenui/ai/mcp";
const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("every family and named export has its own accurate contract", () => {
  const catalog = getCatalog();
  assert.equal(catalog.flavor, "citrionus");
  assert.equal(catalog.aiVersion, pkg.version);
  const exports = new Set();
  for (const family of catalog.components) {
    assert.ok(family.prompt.includes(family.importPath));
    for (const name of family.exportNames) {
      assert.ok(!exports.has(name), `duplicate ${name}`);
      exports.add(name);
      assert.ok(componentExists(name));
      assert.equal(getManifest(name).name, name);
      assert.equal(resolveAlias(name), name);
      assert.equal(getComponentGuidance(name).name, name);
    }
  }
  assert.equal(getManifest("Chart").name, "RaydenChart");
  assert.equal(getManifest("RaydenChart").importPath, "@raydenui/ui/chart");
  assert.equal(getManifest("ActivityFeed").kind, "family");
  assert.deepEqual(getManifest("ActivityFeed").exportNames, ["ActivityItem", "ActivityContent"]);
  for (const name of [
    "Card",
    "Modal",
    "Accordion",
    "DatePicker",
    "Slider",
    "Stepper",
    "Spinner",
    "Banner",
  ])
    assert.equal(getManifest(name).name, name);
  assert.equal(getManifest("ImaginaryWidget"), null);
  assert.equal(getManifest("toString"), null);
  for (const [name, contract] of Object.entries(catalog.motion.exports)) {
    assert.equal(getManifest(name).importPath, "@raydenui/ui/motion");
    assert.ok(contract.prompt.includes("@raydenui/ui/motion"));
  }
  assert.equal(validateComponentUsage("Pressable", { motion: "snappy" }).valid, true);
  assert.equal(validateComponentUsage("Collapse", {}).valid, false);
  assert.equal(validateComponentUsage("Collapse", { open: true }).valid, true);
});

test("structured validation rejects invalid names, props, enums, values and nesting", () => {
  assert.equal(validateComponentUsage("ImaginaryWidget", {}).valid, false);
  assert.equal(validateComponentUsage("ActivityFeed", {}).valid, false);
  assert.equal(validateComponentUsage("Btn", {}).valid, false);
  assert.equal(validateComponentUsage("Button", { size: "giant" }).valid, false);
  assert.equal(validateComponentUsage("Button", { disabled: "yes" }).valid, false);
  assert.equal(validateComponentUsage("Button", { inventedProp: true }).valid, false);
  assert.equal(
    validateComponentUsage("Button", {
      size: "sm",
      disabled: false,
      title: "Save",
      "aria-label": "Save",
      "data-testid": "save",
      onClick: () => {},
    }).valid,
    true
  );
  assert.equal(validateComponentUsage("Modal", {}).valid, false);
  assert.equal(validateComponentUsage("TableRow", {}, ["TableCell"]).valid, true);
  assert.equal(validateComponentUsage("Table", {}, ["TableCell"]).valid, false);
  assert.equal(validateComponentUsage("Card", {}).valid, true); // optional children remain optional
  const dynamic = validateComponentUsage("Button", { size: { $expression: "size" } });
  assert.equal(dynamic.valid, true);
  assert.ok(dynamic.notAssessed.some((s) => s.includes("Button.size")));
  assert.equal(validateComponentUsage("Button", { onClick: "doSomething" }).valid, false);
});

test("MCP handlers validate bad arguments and retain all original tools", () => {
  for (const name of ["get_components", "get_component_props", "get_tokens", "get_layout_recipes"])
    assert.ok(tools.some((t) => t.name === name));
  for (const [name, args] of [
    ["unknown", {}],
    ["get_component_props", {}],
    ["get_component_props", { component: 42 }],
    ["get_components", { category: "invalid" }],
    ["get_tokens", { category: "invalid" }],
    ["get_layout_recipes", { category: "invalid" }],
    ["get_component_props", { component: "imaginary" }],
    ["get_catalog", { flavor: "veyra" }],
    ["get_catalog", { uiVersion: "0.0.0" }],
    ["get_component_guidance", { component: "" }],
    ["validate_component_usage", { component: "Button", props: [], children: [] }],
  ]) {
    const result = callTool(name, args);
    assert.equal(result.isError, true, `${name} ${JSON.stringify(args)}`);
    assert.doesNotThrow(() => JSON.parse(result.content[0].text));
  }
  assert.equal(
    JSON.parse(callTool("get_components", { category: "layout" }).content[0].text).components.some(
      (c) => c.name === "Modal"
    ),
    true
  );
  assert.ok(JSON.parse(callTool("get_layout_recipes", {}).content[0].text).recipes.length > 0);
  assert.equal(
    JSON.parse(
      callTool("validate_component_usage", { component: "Button", props: { size: "giant" } })
        .content[0].text
    ).valid,
    false
  );
});

test("built package imports, declared assets, bin and token helpers work", async () => {
  assert.equal(VERSION, pkg.version);
  for (const [subpath, entry] of Object.entries(pkg.exports)) {
    if (typeof entry === "string") {
      if (!entry.includes("*"))
        assert.ok(existsSync(new URL(`../${entry}`, import.meta.url)), entry);
      continue;
    }
    for (const path of Object.values(entry))
      assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
    if (subpath === "./tokens/dtcg") {
      assert.ok(require("@raydenui/ai/tokens/dtcg").color);
      continue;
    }
    const name = "@raydenui/ai" + (subpath === "." ? "" : subpath.slice(1));
    assert.ok(Object.keys(await import(name)).length, name);
    assert.ok(Object.keys(require(name)).length, name);
  }
  assert.deepEqual(getSpacing(4), { px: "16px", rem: "1rem" });
  assert.ok(getTypography("body-md"));
  assert.equal(
    execFileSync(process.execPath, ["dist/mcp/server.js", "--version"], {
      encoding: "utf8",
    }).trim(),
    pkg.version
  );
  const pack = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: resolve(tmpdir(), "rayden-ai-npm-cache") },
    })
  )[0];
  const files = new Set(pack.files.map((f) => f.path));
  for (const path of [
    "dist/index.js",
    "dist/index.cjs",
    "dist/index.d.ts",
    "dist/mcp/server.js",
    "dist/tokens/tokens.json",
    "dist/tokens/tokens.dtcg.json",
    "dist/tokens/dtcg.d.ts",
    "skills/rayden-use/SKILL.md",
    "RAYDEN_RULES.md",
    "README.md",
    "dist/anatomy/components.json",
    "dist/anatomy/components/button.json",
    "dist/anatomy/schema.json",
    "dist/manifests/components.json",
    "dist/manifests/Button.json",
    "references/naming-conventions.md",
    "references/token-usage.md",
    "references/layout-rules.md",
    "references/component-properties.md",
  ])
    assert.ok(files.has(path), `missing packed file ${path}`);
});

test("token APIs resolve anatomy paths, fractional spacing, numbers, aliases and CSS values", async () => {
  const { resolveDTCGAlias, generateCSSVariables, tokens } = await import("@raydenui/ai/tokens");
  const dtcg = require("@raydenui/ai/tokens/dtcg");
  assert.equal(resolveDTCGAlias("{spacing.0.5}", dtcg), "2px");
  assert.equal(resolveDTCGAlias("{typography.fontWeight.semibold}", dtcg), 600);
  assert.equal(resolveDTCGAlias("{color.white}", dtcg), "#FFFFFF");
  assert.equal(resolveDTCGAlias("{missing}", dtcg), null);
  assert.equal(resolveDTCGAlias("{a}", { a: { $value: "{b}" }, b: { $value: "{a}" } }), null);
  const css = generateCSSVariables();
  assert.ok(css.includes("--spacing-4: 16px;"));
  assert.ok(css.includes("--font-size-body-md: 16px;"));
  assert.ok(css.includes("--radius-sm: 4px;"));
  assert.ok(!css.includes("[object Object]"));
  const runtimeCSS = readFileSync(
    new URL("../../../src/styles/globals.css", import.meta.url),
    "utf8"
  );
  for (const [name, definition] of Object.entries(tokens.colors.action)) {
    if (name === "description") continue;
    const hex = runtimeCSS.match(new RegExp(`--color-action-${name}:\\s*(#[a-fA-F0-9]+)`))?.[1];
    assert.equal(
      definition.hex.toLowerCase(),
      hex?.toLowerCase(),
      `action ${name} drifted from runtime CSS`
    );
  }
});
