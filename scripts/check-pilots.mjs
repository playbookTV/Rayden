import { spawnSync } from "node:child_process";

// Build the UI first: contract coverage and package tests inspect its public exports.
const checks = [
  ["--filter", "@raydenui/ai", "typecheck"],
  ["--filter", "@raydenui/ai", "check-generated"],
  ["--filter", "@raydenui/ai", "build"],
  ["--filter", "@raydenui/ai", "validate-manifests"],
  ["--filter", "@raydenui/ai", "test"],
  ["registry:check"],
  ["check:guidance"],
];
for (const args of checks) {
  const result = spawnSync("pnpm", args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
