import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getCatalog, getComponentGuidance, getManifest } from "@raydenui/ai";

test("icon discovery and guidance agree with the runtime source contract", () => {
  const mapping = JSON.parse(readFileSync(new URL("../src/manifests/icons.generated.json", import.meta.url), "utf8"));
  const catalog = getCatalog();
  assert.deepEqual(catalog.icons.entries, mapping);
  assert.deepEqual(catalog.icons.variants, ["outline", "solid"]);
  assert.equal(catalog.icons.dataImportPath, "@raydenui/ui/icons");
  assert.equal(mapping.find((icon) => icon.name === "3d").exportName, "threeDIcon");
  assert.equal(mapping.find((icon) => icon.name === "heart").exportName, "heartIcon");
  const icon = getManifest("Icon");
  assert.deepEqual(icon.props.variant.values, ["outline", "solid"]);
  assert.ok(icon.props.icon && icon.props.color);
  assert.equal(icon.props.name.required, false);
  const prompt = getComponentGuidance("Icon").prompt;
  assert.ok(prompt.includes("exactly one of name"));
  assert.ok(prompt.includes("catalog.icons.entries"));
  assert.ok(prompt.includes("aria-hidden={false}"));
});
