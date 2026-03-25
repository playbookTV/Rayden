import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import type { ProjectConfig, TemplateContext } from "./types.js";
import { copyTemplateDir, getLatestRaydenVersion } from "./utils/fs.js";
import { runPackageManager } from "./utils/package-manager.js";
import { initGit, isGitInstalled } from "./utils/git.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

export async function scaffold(config: ProjectConfig): Promise<void> {
  const spinner = p.spinner();

  // 1. Check target directory
  if (fs.existsSync(config.targetDir)) {
    const files = fs.readdirSync(config.targetDir);
    if (files.length > 0) {
      const overwrite = await p.confirm({
        message: `Directory "${config.name}" is not empty. Overwrite existing files?`,
        initialValue: false,
      });
      if (p.isCancel(overwrite) || !overwrite) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
      fs.emptyDirSync(config.targetDir);
    }
  } else {
    fs.mkdirSync(config.targetDir, { recursive: true });
  }

  // 2. Build template context
  spinner.start("Fetching latest Rayden UI version...");
  const raydenVersion = await getLatestRaydenVersion();
  spinner.stop(`Using @raydenui/ui@${raydenVersion}`);

  const context: TemplateContext = {
    projectName: config.name,
    packageName: config.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    framework: config.framework,
    template: config.template,
    typescript: config.typescript,
    packageManager: config.packageManager,
    raydenVersion,
  };

  // 3. Copy template files
  spinner.start("Creating project files...");

  const templateBase = path.join(TEMPLATES_DIR, config.framework, config.template);
  const basePath = path.join(templateBase, "base");
  const langPath = path.join(templateBase, config.typescript ? "typescript" : "javascript");

  // Check if templates exist
  if (!fs.existsSync(basePath)) {
    spinner.stop("Template not found");
    p.cancel(
      `Template "${config.framework}/${config.template}" not found. This template may not be available yet.`
    );
    process.exit(1);
  }

  // Copy base files
  await copyTemplateDir(basePath, config.targetDir, context);

  // Copy language-specific files
  if (fs.existsSync(langPath)) {
    await copyTemplateDir(langPath, config.targetDir, context);
  }

  spinner.stop("Project files created");

  // 4. Initialize git
  if (config.git) {
    if (isGitInstalled()) {
      spinner.start("Initializing git repository...");
      try {
        await initGit(config.targetDir);
        spinner.stop("Git repository initialized");
      } catch {
        spinner.stop("Failed to initialize git repository");
      }
    } else {
      p.log.warn("Git is not installed. Skipping git initialization.");
    }
  }

  // 5. Install dependencies
  if (config.install) {
    spinner.start("Installing dependencies...");
    try {
      await runPackageManager(config.packageManager, "install", config.targetDir);
      spinner.stop("Dependencies installed");
    } catch {
      spinner.stop("Failed to install dependencies");
      p.log.warn(
        `Failed to install dependencies. Run "${config.packageManager} install" manually.`
      );
    }
  }
}
