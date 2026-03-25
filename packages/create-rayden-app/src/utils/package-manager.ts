import { execSync } from "child_process";
import type { PackageManager } from "../types.js";

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.includes("pnpm")) return "pnpm";
    if (userAgent.includes("yarn")) return "yarn";
    if (userAgent.includes("npm")) return "npm";
  }

  // Fallback: check if pnpm is available
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
    return "npm";
  }
}

export function getInstallCommand(pm: PackageManager): string {
  return pm === "yarn" ? "yarn" : `${pm} install`;
}

export function getRunCommand(pm: PackageManager, script: string): string {
  if (pm === "npm") return `npm run ${script}`;
  return `${pm} ${script}`;
}

export async function runPackageManager(
  pm: PackageManager,
  command: string,
  cwd: string
): Promise<void> {
  const fullCommand = pm === "yarn" ? `yarn ${command}` : `${pm} ${command}`;

  execSync(fullCommand, {
    cwd,
    stdio: "inherit",
  });
}
