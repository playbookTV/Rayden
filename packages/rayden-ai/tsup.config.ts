import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "manifests/index": "src/manifests/index.ts",
    "tokens/index": "src/tokens/index.ts",
    "recipes/index": "src/recipes/index.ts",
    "rules/index": "src/rules/index.ts",
    "mcp/index": "src/mcp/index.ts",
    "mcp/server": "src/mcp/server.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ["@modelcontextprotocol/sdk"],
});
