import { spawn } from "node:child_process";
import { watch } from "node:fs";

const children = new Set();
function run(args) {
  const child = spawn("pnpm", args, { stdio: "inherit" });
  children.add(child);
  child.on("exit", () => children.delete(child));
  return child;
}
const initial = run(["build"]);
initial.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1);
  run(["exec", "tsup", "--watch", "--no-clean"]);
  run(["exec", "tailwindcss", "-i", "src/styles/globals.css", "-o", "dist/styles.css", "--watch"]);
  let timer;
  let building = false;
  let pending = false;
  function rebuild() {
    if (building) {
      pending = true;
      return;
    }
    building = true;
    run(["exec", "node", "scripts/build-runtime.mjs"]).on("exit", () => {
      building = false;
      if (pending) {
        pending = false;
        rebuild();
      }
    });
  }
  watch("src", { recursive: true }, (_, filename) => {
    if (!filename || !/\.tsx?$/.test(filename)) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  });
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    for (const child of children) child.kill(signal);
    process.exit(0);
  });
}
