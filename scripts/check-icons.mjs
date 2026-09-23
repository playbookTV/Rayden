import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon, Button, Input, iconNames, iconCatalog } from "../dist/index.js";
import * as data from "../dist/icons.js";

const require = createRequire(import.meta.url);
const cjs = require("../dist/icons.cjs");
assert.deepEqual(iconNames, Object.keys(data.icons).sort());
assert.deepEqual(data.iconCatalog, iconCatalog);
for (const { name, exportName } of iconCatalog) {
  assert.deepEqual(data[exportName], data.icons[name], `${name} must map to its real data export`);
  assert.deepEqual(cjs[exportName], data[exportName], `CJS export ${exportName}`);
  for (const variant of ["outline", "solid"]) {
    const markup = renderToStaticMarkup(h(Icon, { icon: data[exportName], variant }));
    assert.ok(
      markup.includes(data[exportName][variant].paths),
      `${name}/${variant} renders on the server`
    );
  }
}
for (const [Component, props] of [
  [Button, { icon: data.checkIcon, iconPosition: "leading", children: "Save" }],
  [Input, { leadingIcon: data.searchIcon, label: "Search" }],
]) {
  const markup = renderToStaticMarkup(h(Component, props));
  assert.ok(markup.includes("<path"), "Static data works in shared icon slots during SSR");
}
const named = renderToStaticMarkup(h(Icon, { name: "heart", size: "lg" }));
assert.ok(named.includes('width="24"'));
assert.ok(!named.includes("<path"), "Name lookup remains deferred until mount");
const accessible = renderToStaticMarkup(
  h(Icon, { icon: data.checkIcon, "aria-hidden": false, role: "img", "aria-label": "Complete" })
);
assert.ok(
  accessible.includes('aria-hidden="false"') && accessible.includes('aria-label="Complete"')
);
console.log(
  `${iconCatalog.length} icon mappings, both variants, ESM/CJS, SSR and shared slots verified.`
);
