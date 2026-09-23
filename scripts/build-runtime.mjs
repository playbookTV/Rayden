import { readdir, readFile, writeFile, mkdir, stat, rm, cp } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { createRequire } from "node:module";

if (process.argv.includes("--clean")) {
  await rm(path.resolve("dist"), { recursive: true, force: true });
  process.exit(0);
}

// Keep modules separate so a consumer can discard unused components, including
// their initialization and large illustration data, before bundling.
const sourceRoot = path.resolve("src");
async function sources(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) return sources(file);
        return /\.tsx?$/.test(file) && !/\.(stories|test|spec|d)\.tsx?$/.test(file) ? [file] : [];
      })
    )
  ).flat();
}
async function resolveImport(sourceFile, specifier, extension) {
  const base = path.resolve(path.dirname(sourceFile), specifier);
  for (const candidate of [
    base + ".ts",
    base + ".tsx",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    if (
      await stat(candidate).then(
        (s) => s.isFile(),
        () => false
      )
    ) {
      let relative = path
        .relative(path.dirname(sourceFile), candidate)
        .replaceAll(path.sep, "/")
        .replace(/\.tsx?$/, extension);
      if (!relative.startsWith(".")) relative = "./" + relative;
      return relative;
    }
  }
  throw new Error(`Unresolved runtime import ${specifier} in ${sourceFile}`);
}
for (const file of await sources(sourceRoot)) {
  const source = await readFile(file, "utf8");
  for (const [module, extension] of [
    [ts.ModuleKind.ESNext, ".js"],
    [ts.ModuleKind.CommonJS, ".cjs"],
  ]) {
    let output = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        importHelpers: false,
      },
    }).outputText;
    const imports = [
      ...output.matchAll(/(from\s+|import\(\s*|require\(\s*|import\s*)(["'])(\.[^"']+)\2/g),
    ];
    for (const match of imports.reverse()) {
      const replacement =
        match[1] + match[2] + (await resolveImport(file, match[3], extension)) + match[2];
      output =
        output.slice(0, match.index) + replacement + output.slice(match.index + match[0].length);
    }
    const destination = path.join(
      "dist",
      path.relative(sourceRoot, file).replace(/\.tsx?$/, extension)
    );
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, output);
  }
}

// Give the static public icon entry its own module boundary. Sharing the same
// module with Icon's optional dynamic registry makes bundlers hoist the entire
// registry into a shared initial chunk, even when only one static icon is used.
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve("tsup"))("esbuild");
for (const [format, extension] of [
  ["esm", "js"],
  ["cjs", "cjs"],
]) {
  await build({
    entryPoints: ["src/icons.ts"],
    bundle: true,
    format,
    target: "es2020",
    outfile: `dist/icons.${extension}`,
  });
}

// Optional self-hosted typefaces are shipped beside their CSS entry.
await cp("src/styles/fonts.css", "dist/fonts.css");
await cp("src/styles/fonts", "dist/fonts", { recursive: true });
