// Parse the JSX in each MDX page with the TypeScript parser and compare attribute
// names / literal values against the real component types from the built .d.ts.
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dts = ["dist/index.d.ts", "dist/blocks.d.ts", "dist/chart.d.ts"];
const program = ts.createProgram(dts, { skipLibCheck: true, strict: false });
const checker = program.getTypeChecker();

const api = new Map();
for (const file of dts) {
  const src = program.getSourceFile(file);
  if (!src) continue;
  ts.forEachChild(src, (node) => {
    let name, typeNode;
    if (ts.isVariableStatement(node)) {
      const d = node.declarationList.declarations[0];
      if (!d?.name || !ts.isIdentifier(d.name)) return;
      name = d.name.text; typeNode = d.type;
    } else if (ts.isFunctionDeclaration(node) && node.name) {
      name = node.name.text; typeNode = node.parameters[0]?.type;
    } else return;
    if (!name || !/^[A-Z]/.test(name) || !typeNode) return;
    const t = checker.getTypeAtLocation(typeNode);
    let propsType = t;
    const sigs = t.getCallSignatures();
    if (sigs.length && sigs[0].getParameters()[0]?.valueDeclaration)
      propsType = checker.getTypeOfSymbolAtLocation(sigs[0].getParameters()[0], typeNode);
    else if (ts.isTypeReferenceNode(typeNode) && typeNode.typeArguments?.length)
      propsType = checker.getTypeFromTypeNode(typeNode.typeArguments[0]);
    const props = new Set(propsType.getProperties().map((p) => p.getName()));
    if (!props.size) return;
    const unions = new Map();
    for (const p of propsType.getProperties()) {
      const pt = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration ?? typeNode);
      const parts = pt.isUnion() ? pt.types : [pt];
      const lits = parts.filter((x) => x.isStringLiteral()).map((x) => x.value);
      const other = parts.filter((x) => !x.isStringLiteral() && !(x.flags & ts.TypeFlags.Undefined));
      if (lits.length && !other.length) unions.set(p.getName(), new Set(lits));
    }
    api.set(name, { props, unions });
  });
}

const iconNames = new Set(
  [...readFileSync("src/components/Icon/icons.ts", "utf8").matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1])
);
const illoSrc = readFileSync("src/components/EmptyStateIllustration/illustrations.ts", "utf8");
const illoNames = new Set([...illoSrc.matchAll(/^\s{2}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]));

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".mdx")) files.push(p);
  }
})("packages/docs/content");

const findings = [];
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  // Strip frontmatter, then treat the whole body as JSX-bearing text. Fences are kept:
  // the copyable code matters as much as the live preview.
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^```\w*$/gm, "").replace(/^```$/gm, "");
  const src = ts.createSourceFile("x.tsx", `<>${body}</>`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(src);
      const entry = api.get(tag);
      if (entry) {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr)) continue;
          const prop = attr.name.getText(src);
          if (["key", "className", "ref", "style"].includes(prop)) continue;
          if (prop.startsWith("data-") || prop.startsWith("aria-")) continue;
          const line = src.getLineAndCharacterOfPosition(attr.getStart(src)).line + 1;
          if (!entry.props.has(prop)) { findings.push({ file, line, tag, prop, issue: "unsupported prop" }); continue; }
          // A prop can exist only because the component spreads HTMLAttributes, so it
          // type-checks while doing nothing. These two shapes both shipped in the docs:
          // `title` on a component whose real text prop is `label`, and `onChange` on
          // one whose real callback is `onValueChange`.
          if (prop === "onChange" && entry.props.has("onValueChange"))
            findings.push({ file, line, tag, prop, issue: "inert prop — use onValueChange" });
          if (prop === "title" && entry.props.has("label"))
            findings.push({ file, line, tag, prop, issue: "inert prop — use label" });
          const init = attr.initializer;
          const value = init && ts.isStringLiteral(init) ? init.text : undefined;
          if (value === undefined) continue;
          const u = entry.unions.get(prop);
          if (u && !u.has(value)) findings.push({ file, line, tag, prop, value, issue: "unsupported value", allowed: [...u] });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(src);
}
const byFile = {};
for (const f of findings) (byFile[f.file] ??= []).push(f);
for (const [f, items] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${String(items.length).padStart(3)}  ${f.replace("packages/docs/content/", "")}`);
  const seen = new Set();
  for (const i of items) {
    const k = `${i.tag}.${i.prop}${i.value ? '="' + i.value + '"' : ""}`;
    if (seen.has(k)) continue; seen.add(k);
    console.log(`       ${i.issue}: ${k}${i.allowed ? "  [" + i.allowed.slice(0, 6).join("|") + (i.allowed.length > 6 ? ",…" : "") + "]" : ""}`);
  }
}
console.log(`\nTOTAL: ${findings.length} occurrences across ${Object.keys(byFile).length} pages`);
if (findings.length) {
  console.error("\nDocumentation uses props or values the components do not accept.");
  process.exit(1);
}
