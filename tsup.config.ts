import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    preset: "src/preset.ts",
    icons: "src/icons.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  external: ["react", "react-dom", "clsx", "tailwind-merge"],
  treeshake: true,
  splitting: false,
});
