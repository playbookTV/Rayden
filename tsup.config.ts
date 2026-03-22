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
  external: [
    "react",
    "react-dom",
    "clsx",
    "tailwind-merge",
    "chart.js",
    "react-chartjs-2",
    "chart.js/auto",
  ],
  treeshake: true,
  splitting: false,
});
