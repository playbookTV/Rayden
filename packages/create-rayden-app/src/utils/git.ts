import { execSync } from "child_process";

export function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export async function initGit(cwd: string): Promise<void> {
  if (!isGitInstalled()) {
    throw new Error("Git is not installed");
  }

  execSync("git init", { cwd, stdio: "ignore" });
  execSync("git add -A", { cwd, stdio: "ignore" });
  execSync('git commit -m "Initial commit from create-rayden-app"', {
    cwd,
    stdio: "ignore",
  });
}
