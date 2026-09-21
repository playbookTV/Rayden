import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { generateRegistry, root } from "./registry-build.mjs";

const require = createRequire(process.env.RAYDEN_REGISTRY_TOOLING || import.meta.url);
const cli = require.resolve("shadcn");
const cliPackage = JSON.parse(
  await readFile(path.resolve(path.dirname(cli), "../package.json"), "utf8")
);
assert.equal(cliPackage.version, "4.21.0", "Reverify the pilot before changing the CLI pin");
const args = process.argv.slice(2);
const tarballIndex = args.indexOf("--tarball");
if (tarballIndex < 0 || !args[tarballIndex + 1]) {
  throw new Error(
    "Pass --tarball /absolute/path/to/fresh-raydenui-ui.tgz from the current UI build."
  );
}
const tarball = path.resolve(args[tarballIndex + 1]);
await readFile(tarball);
const { version, builtItems } = await generateRegistry({ check: true });
const directory = await mkdtemp(path.join(tmpdir(), "rayden-registry-smoke-"));
const requests = [];
const server = createServer(async (request, response) => {
  const name = request.url
    ?.split("/")
    .pop()
    ?.replace(/\.json$/, "");
  const item = builtItems.find((entry) => entry.name === name);
  if (!request.url?.startsWith(`/r/${version}/`) || !item) {
    response.writeHead(404).end();
    return;
  }
  requests.push(name);
  // Only the test server substitutes the unpublished local package. Generated
  // registry payloads retain their real exact npm version dependencies.
  const fixtureItem = {
    ...item,
    dependencies: item.dependencies.map((dependency) =>
      dependency.startsWith("@raydenui/ui@") ? `file:${tarball}` : dependency
    ),
  };
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify(fixtureItem));
});

async function run(command, commandArgs) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: directory,
      stdio: "inherit",
      env: {
        ...process.env,
        CI: "true",
        npm_config_audit: "false",
        npm_config_fund: "false",
        npm_config_ignore_scripts: "true",
      },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`))
    );
  });
}

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  const namespaceUrl = `http://127.0.0.1:${port}/r/${version}/{name}.json`;
  await mkdir(path.join(directory, "src/lib"), { recursive: true });
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify(
      {
        name: "rayden-registry-install-fixture",
        private: true,
        version: "0.0.0",
        type: "module",
        dependencies: { react: "19.2.4", "react-dom": "19.2.4" },
        devDependencies: {
          "@types/react": "19.2.14",
          "@types/react-dom": "19.2.3",
          typescript: "5.9.3",
          vite: "7.3.1",
          tailwindcss: "4.2.1",
        },
      },
      null,
      2
    )
  );
  await writeFile(
    path.join(directory, "components.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "new-york",
        rsc: false,
        tsx: true,
        tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true },
        aliases: {
          components: "@/components",
          ui: "@/components/ui",
          utils: "@/lib/utils",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: { "@rayden": namespaceUrl },
      },
      null,
      2
    )
  );
  await writeFile(
    path.join(directory, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
      },
      null,
      2
    )
  );
  await writeFile(path.join(directory, "src/index.css"), '@import "tailwindcss";\n');
  await writeFile(
    path.join(directory, "index.html"),
    '<html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n'
  );
  await run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"]);
  await run(process.execPath, [
    cli,
    "add",
    "@rayden/button-actions",
    "@rayden/workspace-tabs",
    "@rayden/motion-tabs",
    "--yes",
    "--cwd",
    directory,
  ]);
  for (const name of ["setup", "rules", "button-actions", "workspace-tabs", "motion-tabs"]) {
    assert(requests.includes(name), `Official CLI did not resolve @rayden/${name}`);
  }
  const expectedFiles = [
    "src/components/button-actions.tsx",
    "src/components/workspace-tabs.tsx",
    "src/components/motion-tabs.tsx",
    "styles/rayden.css",
    "rayden/RAYDEN.md",
  ];
  for (const file of expectedFiles)
    assert((await readFile(path.join(directory, file), "utf8")).length > 0);
  await writeFile(
    path.join(directory, "src/main.tsx"),
    `import { createRoot } from "react-dom/client";
import { ButtonActions } from "./components/button-actions";
import { WorkspaceTabs } from "./components/workspace-tabs";
import { MotionTabs } from "./components/motion-tabs";
import "../styles/rayden.css";
createRoot(document.getElementById("root")!).render(<main><ButtonActions onSave={() => {}} onCancel={() => {}} /><WorkspaceTabs /><MotionTabs /></main>);
`
  );
  await run(process.execPath, [
    path.join(directory, "node_modules/typescript/bin/tsc"),
    "--noEmit",
  ]);
  await run(process.execPath, [path.join(directory, "node_modules/vite/bin/vite.js"), "build"]);
  const installed = JSON.parse(
    await readFile(path.join(directory, "node_modules/@raydenui/ui/package.json"), "utf8")
  );
  const local = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  assert.equal(installed.version, local.version);
  console.log(
    JSON.stringify(
      {
        result: "passed",
        fixture: directory,
        cliVersion: cliPackage.version,
        namespaceUrl,
        fetchedItems: [...new Set(requests)],
        packageVersion: installed.version,
        localTarballOverride: tarball,
      },
      null,
      2
    )
  );
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  console.log(`Fixture retained at ${directory}`);
}
