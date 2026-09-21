/** Derive public export mappings and statically checkable prop contracts from UI source. */
import ts from "typescript";
import { motionPresets, motionRecipes } from "../../../src/motion/presets";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const registry = JSON.parse(
  readFileSync(resolve(root, "packages/rayden-ai/src/manifests/components.json"), "utf8")
);
const exports: Record<string, any> = {};
const platformTypes: Record<string, any> = {};
const platformTypeIds = new Map<string, string>();
function internPlatformType(type: any): string {
  const serialized = JSON.stringify(type);
  let id = platformTypeIds.get(serialized);
  if (!id) {
    id = `p${platformTypeIds.size}`;
    platformTypeIds.set(serialized, id);
    platformTypes[id] = type;
  }
  return id;
}
function describe(type: ts.Type): any {
  if (type.isUnion()) {
    const types = type.types.filter((t) => !(t.flags & ts.TypeFlags.Undefined));
    if (types.length === 1) return describe(types[0]);
    if (
      types.every(
        (t) => t.isStringLiteral() || t.isNumberLiteral() || t.flags & ts.TypeFlags.BooleanLiteral
      )
    ) {
      const values = types.map((t) =>
        t.isStringLiteral() || t.isNumberLiteral() ? t.value : (t as any).intrinsicName === "true"
      );
      if (values.length === 2 && values.includes(true) && values.includes(false))
        return { type: "boolean" };
      return { type: "enum", values };
    }
    return { type: "union", alternatives: types.map(describe) };
  }
  if (type.isStringLiteral() || type.isNumberLiteral())
    return { type: "enum", values: [type.value] };
  if (type.flags & ts.TypeFlags.String) return { type: "string" };
  if (type.flags & ts.TypeFlags.Number) return { type: "number" };
  if (type.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) return { type: "boolean" };
  if (type.flags & ts.TypeFlags.Null) return { type: "null" };
  if (checker.getSignaturesOfType(type, ts.SignatureKind.Call).length) return { type: "function" };
  if (checker.isArrayType(type) || checker.isTupleType(type)) return { type: "array" };
  if (type.flags & ts.TypeFlags.Object) return { type: "object" };
  return { type: "unassessed" };
}
for (const entry of ["src/index.ts", "src/chart.ts", "src/motion/index.ts"]) {
  const source = program.getSourceFile(resolve(root, entry))!;
  for (const statement of source.statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      statement.isTypeOnly ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause)
    )
      continue;
    const module = (statement.moduleSpecifier as ts.StringLiteral)?.text;
    if (!module?.startsWith("./components/") && entry !== "src/motion/index.ts") continue;
    for (const specifier of statement.exportClause.elements) {
      if (specifier.isTypeOnly) continue;
      const name = specifier.name.text;
      const symbol = checker.getSymbolAtLocation(specifier.name)!;
      const target = checker.getAliasedSymbol(symbol);
      const type = checker.getTypeOfSymbolAtLocation(target, target.valueDeclaration ?? source);
      const call = checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0];
      if (!/^[A-Z]/.test(name) || !call?.parameters[0]) continue; // helpers are not JSX components
      const propsType = checker.getTypeOfSymbolAtLocation(
        call.parameters[0],
        call.parameters[0].valueDeclaration ?? source
      );
      const props: Record<string, any> = {};
      const inheritedProps: string[] = [];
      const inheritedPropTypes: Record<string, any> = {};
      for (const prop of checker
        .getPropertiesOfType(propsType)
        .sort((a, b) => a.name.localeCompare(b.name))) {
        const decl = prop.valueDeclaration ?? prop.declarations?.[0];
        if (!decl) continue;
        if (decl.getSourceFile().fileName.includes("node_modules")) {
          inheritedProps.push(prop.name);
          const platformType = describe(checker.getTypeOfSymbolAtLocation(prop, decl));
          if (["string", "number", "boolean", "function", "enum"].includes(platformType.type))
            inheritedPropTypes[prop.name] = internPlatformType(platformType);
          continue;
        }
        const propType = checker.getTypeOfSymbolAtLocation(prop, decl);
        props[prop.name] = {
          ...describe(propType),
          // These are display types, not standalone declarations. Preserve external
          // aliases so React types do not expand to imports of checkout-specific paths.
          typeText: checker.typeToString(
            propType,
            decl,
            ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
          ),
          required: !(prop.flags & ts.SymbolFlags.Optional),
          description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
        };
      }
      exports[name] = {
        name,
        importPath:
          entry === "src/motion/index.ts"
            ? "@raydenui/ui/motion"
            : entry.endsWith("chart.ts")
              ? "@raydenui/ui/chart"
              : "@raydenui/ui",
        sourceModule: module.replace(
          "./",
          entry === "src/motion/index.ts" ? "src/motion/" : "src/"
        ),
        props,
        inheritedProps,
        inheritedPropTypes,
      };
    }
  }
}
const families = registry.components.map((item: any) => {
  const expected =
    item.name === "ActivityFeed" ? item.subComponents : [item.name, ...(item.subComponents ?? [])];
  for (const name of expected)
    if (!exports[name]) throw new Error(`${item.name}: missing public component ${name}`);
  return {
    name: item.name,
    manifestFile: item.manifestFile,
    exportNames: expected,
    importPath: exports[expected[0]].importPath,
  };
});
const mapped = families.flatMap((family: any) => family.exportNames);
const motionExports = Object.fromEntries(
  Object.entries(exports).filter(([, value]) => value.importPath === "@raydenui/ui/motion")
);
for (const name of Object.keys(motionExports)) delete exports[name];
for (const name of Object.keys(exports))
  if (!mapped.includes(name)) throw new Error(`Uncatalogued public component ${name}`);
if (new Set(mapped).size !== mapped.length) throw new Error("Duplicate component export mappings");
const ui = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const ai = JSON.parse(readFileSync(resolve(root, "packages/rayden-ai/package.json"), "utf8"));
const data =
  JSON.stringify(
    {
      schemaVersion: "1.0.0",
      flavor: "citrionus",
      uiVersion: ui.version,
      aiVersion: ai.version,
      families,
      exports,
      platformTypes,
      motion: {
        importPath: "@raydenui/ui/motion",
        presets: motionPresets,
        recipes: motionRecipes,
        exports: motionExports,
      },
    },
    null,
    2
  ) + "\n";
const path = resolve(root, "packages/rayden-ai/src/manifests/contracts.generated.json");
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8") !== data)
    throw new Error(
      "Public contracts are stale. Run npm run generate-manifests in packages/rayden-ai."
    );
} else writeFileSync(path, data);
console.log(
  `Verified ${families.length} families and ${Object.keys(exports).length} component exports.`
);
